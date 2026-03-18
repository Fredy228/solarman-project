import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Response } from 'express';

import { AuthErrorMessage } from '../../../common/messages/error/auth.message';
import { ProtectReqType } from '../../../common/types/request.type';
import { CustomHttpExceptionUtil } from '../../../helpers/custom-http-exection.util';
import { BlocklistService } from '../../../libs/blocklist/blocklist.service';
import { ProtectBaseAbstract } from './protect-base.abstract';

@Injectable()
export class ProtectAuthMiddleware
  extends ProtectBaseAbstract
  implements NestMiddleware
{
  constructor(
    jwtService: JwtService,
    private readonly blocklist: BlocklistService,
  ) {
    super(jwtService);
  }

  use(req: ProtectReqType, _: Response, next: NextFunction) {
    const { exp: _exp, ...user } = this.verifyToken(req.cookies?.accessToken);

    if (this.blocklist.isBlocked(user.id))
      throw new CustomHttpExceptionUtil(
        HttpStatus.UNAUTHORIZED,
        AuthErrorMessage.USER_BLOCKED,
      );

    req.user = user;
    next();
  }
}
