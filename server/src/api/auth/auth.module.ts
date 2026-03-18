import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { ProtectAuthMiddleware } from '../../common/middleware/auth/protect-auth.middleware';
import { ProtectRefreshMiddleware } from '../../common/middleware/auth/protect-refresh.middleware';
import { UserAgentMiddleware } from '../../common/middleware/user-agent.middleware';
import { HashModule } from '../../libs/hash/hash.module';
import { TelegramModule } from '../../libs/telegram/telegram.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [HashModule, TelegramModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectRefreshMiddleware).forRoutes({
      path: '/auth/refresh',
      method: RequestMethod.GET,
    });

    consumer.apply(ProtectAuthMiddleware).forRoutes(
      {
        path: '/auth/check',
        method: RequestMethod.GET,
      },
      {
        path: '/auth/change-password',
        method: RequestMethod.PATCH,
      },
    );

    consumer.apply(UserAgentMiddleware).forRoutes(
      {
        path: '/auth/register',
        method: RequestMethod.POST,
      },
      {
        path: '/auth/login',
        method: RequestMethod.POST,
      },
      {
        path: '/auth/refresh',
        method: RequestMethod.GET,
      },
    );
  }
}
