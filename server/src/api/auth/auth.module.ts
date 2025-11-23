import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserAgentMiddleware } from '../../common/middleware/user-agent.middleware';
import { ProtectRefreshMiddleware } from '../../common/middleware/auth/protect-refresh.middleware';
import { ProtectAuthMiddleware } from '../../common/middleware/auth/protect-auth.middleware';
import { HashModule } from '../../libs/hash/hash.module';

@Module({
  imports: [HashModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectRefreshMiddleware).forRoutes({
      path: '/auth/refresh',
      method: RequestMethod.GET,
    });

    consumer.apply(ProtectAuthMiddleware).forRoutes({
      path: '/auth/check',
      method: RequestMethod.GET,
    });

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
