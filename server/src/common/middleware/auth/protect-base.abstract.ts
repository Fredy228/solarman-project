import { JwtService } from '@nestjs/jwt';
import { HttpStatus } from '@nestjs/common';

import { CustomHttpExceptionUtil } from '../../../helpers/custom-http-exection.util';
import { TUserAuth } from '../../../common/types/user.type';
import { AuthErrorMessage } from '../../../common/messages/error/auth.message';

export abstract class ProtectBaseAbstract {
  protected constructor(protected readonly jwtService: JwtService) {}

  verifyToken(token: string): TUserAuth & { exp: number } {
    if (!token)
      throw new CustomHttpExceptionUtil(
        HttpStatus.UNAUTHORIZED,
        AuthErrorMessage.TOKEN_UNAUTHORIZED,
      );

    try {
      const decodedToken: TUserAuth & { exp: number } =
        this.jwtService.verify(token);
      if (!decodedToken) new Error('decodedToken is empty');
      return decodedToken;
    } catch {
      throw new CustomHttpExceptionUtil(
        HttpStatus.UNAUTHORIZED,
        AuthErrorMessage.TOKEN_UNAUTHORIZED,
      );
    }
  }
}
