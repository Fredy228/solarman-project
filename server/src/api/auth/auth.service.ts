import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { type AgentDetails } from 'express-useragent';
import { UserDevice } from '@prisma/client';

import { AuthErrorMessage } from '../../common/messages/error/auth.message';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../../libs/prisma/prisma.service';
import { TokenType } from '../../common/types/token.type';
import { TUserAuth } from '../../common/types/user.type';
import { CustomHttpExceptionUtil } from '../../helpers/custom-http-exection.util';
import { HashService } from '../../libs/hash/hash.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly hashService: HashService,
  ) {}

  async singInCredentials(
    { email, password }: LoginDto,
    ipAddress: string,
    userAgent?: AgentDetails,
  ): Promise<TokenType> {
    const existUser = await this.prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
        email: true,
        name: true,
        role: true,
        isBlocked: true,
      },
    });
    if (!existUser)
      throw new CustomHttpExceptionUtil(
        HttpStatus.UNAUTHORIZED,
        AuthErrorMessage.LOGIN_UNAUTHORIZED,
      );

    const { isBlocked, password: hash, ...user } = existUser;

    if (isBlocked)
      throw new CustomHttpExceptionUtil(
        HttpStatus.UNAUTHORIZED,
        AuthErrorMessage.USER_BLOCKED,
      );

    const isValidPass = await this.hashService.compareHash(password, hash);
    if (!isValidPass)
      throw new CustomHttpExceptionUtil(
        HttpStatus.FORBIDDEN,
        AuthErrorMessage.LOGIN_UNAUTHORIZED,
      );

    return this.generateToken(user, userAgent, ipAddress);
  }

  async logout(device: UserDevice): Promise<void> {
    await this.prisma.userDevice.delete({ where: { id: device.id } });
  }

  async refreshToken(
    user: TUserAuth,
    device: UserDevice,
    userAgent: AgentDetails,
    ipAddress: string,
  ): Promise<TokenType> {
    return this.generateToken(user, userAgent, ipAddress, device.id);
  }

  private async generateToken(
    payload: Omit<TUserAuth, 'deviceId'>,
    userAgent: AgentDetails | undefined,
    ipAddress: string,
    currentDeviceId?: string,
  ): Promise<TokenType> {
    let deviceId = currentDeviceId;
    if (!deviceId) {
      const device = await this.prisma.userDevice.create({
        data: {
          ipAddress,
          details: userAgent
            ? {
                browser: userAgent.browser,
                os: userAgent.os,
                platform: userAgent.platform,
                version: String(userAgent.version),
              }
            : undefined,
          user: {
            connect: {
              id: payload.id,
            },
          },
        },
      });
      deviceId = device.id;
    }

    const tokenPayload = {
      ...payload,
      deviceId: deviceId,
    };

    const accessToken = this.jwtService.sign(tokenPayload);
    const refreshToken = this.jwtService.sign<TUserAuth>(tokenPayload, {
      expiresIn: this.configService.getOrThrow('JWT_EXPIRE_REFRESH_TOKEN'),
    });

    this.prisma.userDevice
      .update({
        where: {
          id: deviceId,
        },
        data: { accessToken, refreshToken },
      })
      .catch((error) => {
        this.logger.error(`Error updating device [generateToken]:`, error);
      });

    return { accessToken, refreshToken };
  }
}
