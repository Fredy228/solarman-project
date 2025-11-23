import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDevice } from '@prisma/client';
import { NextFunction, Response, Request } from 'express';

import { ProtectBaseAbstract } from './protect-base.abstract';
import { PrismaService } from '../../../libs/prisma/prisma.service';
import { TUserAuth } from '../../../common/types/user.type';
import { CustomHttpExceptionUtil } from '../../../helpers/custom-http-exection.util';
import { AuthErrorMessage } from '../../../common/messages/error/auth.message';

@Injectable()
export class ProtectRefreshMiddleware
  extends ProtectBaseAbstract
  implements NestMiddleware
{
  constructor(
    private readonly prisma: PrismaService,
    jwtService: JwtService,
  ) {
    super(jwtService);
  }
  async use(
    req: Request & {
      user: TUserAuth;
      device: UserDevice;
    },
    _: Response,
    next: NextFunction,
  ) {
    const token = req.cookies.refreshToken as string;
    const { id } = this.verifyToken(token);

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        isBlocked: true,
        role: true,
        devices: true,
        name: true,
      },
    });

    if (!user)
      throw new CustomHttpExceptionUtil(
        HttpStatus.UNAUTHORIZED,
        AuthErrorMessage.TOKEN_UNAUTHORIZED,
      );
    const { isBlocked, devices, ...user_t } = user;
    if (isBlocked)
      throw new CustomHttpExceptionUtil(
        HttpStatus.FORBIDDEN,
        AuthErrorMessage.USER_BLOCKED,
      );

    const device = devices.find((i) => i.refreshToken === token);
    if (!device)
      throw new CustomHttpExceptionUtil(
        HttpStatus.UNAUTHORIZED,
        AuthErrorMessage.TOKEN_UNAUTHORIZED,
      );

    req.user = { ...user_t, deviceId: device.id };
    req.device = device;
    next();
  }
}
