import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Response } from 'express';

import { ProtectBaseAbstract } from './protect-base.abstract';
import { ProtectReqType } from '../../../common/types/request.type';

@Injectable()
export class ProtectAuthMiddleware
  extends ProtectBaseAbstract
  implements NestMiddleware
{
  constructor(jwtService: JwtService) {
    super(jwtService);
  }

  use(req: ProtectReqType, _: Response, next: NextFunction) {
    const { exp: _exp, ...user } = this.verifyToken(req.cookies.accessToken);

    req.user = user;
    next();
  }
}
