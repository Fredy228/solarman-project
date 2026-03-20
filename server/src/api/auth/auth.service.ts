import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserDevice } from '@prisma/client';
import { randomInt } from 'crypto';
import { type AgentDetails } from 'express-useragent';

import { AuthErrorMessage } from '../../common/messages/error/auth.message';
import { TokenType } from '../../common/types/token.type';
import { TUserAuth } from '../../common/types/user.type';
import { CustomHttpExceptionUtil } from '../../helpers/custom-http-exection.util';
import { BlocklistService } from '../../libs/blocklist/blocklist.service';
import { HashService } from '../../libs/hash/hash.service';
import { PrismaService } from '../../libs/prisma/prisma.service';
import { TelegramService } from '../../libs/telegram/telegram.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private readonly resetTokens = new Map<
    string,
    { userId: string; expiresAt: number }
  >();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly hashService: HashService,
    private readonly telegramService: TelegramService,
    private readonly blocklistService: BlocklistService,
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
        phone: true,
        isBlocked: true,
        telegramId: true,
      },
    });
    if (!existUser)
      throw new CustomHttpExceptionUtil(
        HttpStatus.UNAUTHORIZED,
        AuthErrorMessage.LOGIN_UNAUTHORIZED,
      );

    const { isBlocked, password: hash, telegramId, ...user } = existUser;

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

    if (telegramId) {
      this.telegramService
        .sendLoginAlert({
          telegramId,
          userId: user.id,
          name: user.name,
          email: user.email ?? email,
          ip: ipAddress,
          browser: userAgent?.browser,
          os: userAgent?.os,
          platform: userAgent?.platform,
        })
        .catch((err) =>
          this.logger.error('Failed to send login alert via Telegram', err),
        );
    }

    return this.generateToken(user, userAgent, ipAddress);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: { password: true },
    });

    const isValid = await this.hashService.compareHash(
      currentPassword,
      user.password,
    );
    if (!isValid)
      throw new CustomHttpExceptionUtil(
        HttpStatus.BAD_REQUEST,
        AuthErrorMessage.WRONG_CURRENT_PASSWORD,
      );

    const hashPass = await this.hashService.createHash(newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashPass },
    });
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

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { email },
      select: { id: true, name: true, telegramId: true },
    });

    if (!user || !user.telegramId) {
      throw new CustomHttpExceptionUtil(
        HttpStatus.BAD_REQUEST,
        AuthErrorMessage.TELEGRAM_NOT_LINKED,
      );
    }

    const code = String(randomInt(100000, 999999));
    const expiresAt = Date.now() + 15 * 60 * 1000;

    for (const [token, entry] of this.resetTokens.entries()) {
      if (entry.userId === user.id) this.resetTokens.delete(token);
    }

    this.resetTokens.set(code, { userId: user.id, expiresAt });

    await this.telegramService.sendPasswordResetCode(
      user.telegramId,
      code,
      user.name,
    );
  }

  async resetPassword(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      throw new CustomHttpExceptionUtil(
        HttpStatus.BAD_REQUEST,
        AuthErrorMessage.RESET_TOKEN_INVALID,
      );
    }

    const entry = this.resetTokens.get(code);
    if (!entry || entry.userId !== user.id || Date.now() > entry.expiresAt) {
      throw new CustomHttpExceptionUtil(
        HttpStatus.BAD_REQUEST,
        AuthErrorMessage.RESET_TOKEN_INVALID,
      );
    }

    this.resetTokens.delete(code);

    const hashPass = await this.hashService.createHash(newPassword);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashPass },
    });
    await this.prisma.userDevice.deleteMany({ where: { userId: user.id } });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await this.blocklistService.unblock(user.id);
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
