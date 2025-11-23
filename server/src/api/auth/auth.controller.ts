import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { UserDevice } from '@prisma/client';
import { type Request, type Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AgentDetails } from 'express-useragent';

import { AuthService } from './auth.service';
import { IpAddress } from '../../common/decorator/ip-address.decorator';
import { LoginDto } from './dto/login.dto';
import { ETokenAuth } from '../../common/enums/token-auth.enum';
import { type ProtectReqType } from '../../common/types/request.type';

@Controller('auth')
export class AuthController {
  private readonly COOKIES_EXPIRE: number;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.COOKIES_EXPIRE = this.configService.get<number>('COOKIES_EXPIRE')!;
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @IpAddress() ip: string,
  ) {
    const result = await this.authService.singInCredentials(
      body,
      ip,
      req['useragent'] as AgentDetails,
    );
    res.cookie(ETokenAuth.REFRESH, result.refreshToken, {
      httpOnly: true,
      maxAge: this.COOKIES_EXPIRE,
    });
    res.cookie(ETokenAuth.ACCESS, result.accessToken, {
      httpOnly: true,
      maxAge: this.COOKIES_EXPIRE,
    });
    res.json({ accessToken: result.accessToken });
  }

  @Get('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Req() req: ProtectReqType & { device?: UserDevice },
    @Res() res: Response,
  ) {
    if (req.device) await this.authService.logout(req.device);
    res.clearCookie(ETokenAuth.ACCESS);
    res.clearCookie(ETokenAuth.REFRESH);
    res.status(HttpStatus.NO_CONTENT).end();
  }

  @Get('/refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: ProtectReqType & { device: UserDevice },
    @Res({ passthrough: true }) res: Response,
    @IpAddress() ip: string,
  ) {
    const tokens = await this.authService.refreshToken(
      req.user,
      req.device,
      req['useragent'] as AgentDetails,
      ip,
    );
    res.cookie(ETokenAuth.REFRESH, tokens.refreshToken, {
      httpOnly: true,
      maxAge: this.COOKIES_EXPIRE,
    });
    res.cookie(ETokenAuth.ACCESS, tokens.accessToken, {
      httpOnly: true,
      maxAge: this.COOKIES_EXPIRE,
    });
    res.json({ accessToken: tokens.accessToken });
  }

  @Get('/check')
  @HttpCode(HttpStatus.OK)
  authCheck(@Req() req: ProtectReqType) {
    return req.user;
  }
}
