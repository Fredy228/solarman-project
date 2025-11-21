import { JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const jwtConfig = (config: ConfigService): JwtModuleOptions => {
  return {
    secret: config.get('JWT_SECRET'),
    signOptions: { expiresIn: config.get('JWT_EXPIRE_ACCESS_TOKEN') },
  };
};
