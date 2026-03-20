import { Module, type MiddlewareConsumer } from '@nestjs/common';

import { ProtectAuthMiddleware } from 'src/common/middleware/auth/protect-auth.middleware';
import { GlobalParamController } from './global-param.controller';
import { GlobalParamService } from './global-param.service';

@Module({
  providers: [GlobalParamService],
  controllers: [GlobalParamController],
})
export class GlobalParamModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(GlobalParamController);
  }
}
