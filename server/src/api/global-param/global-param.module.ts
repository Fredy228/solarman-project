import { Module, type MiddlewareConsumer } from '@nestjs/common';

import { ProtectAuthMiddleware } from 'src/common/middleware/auth/protect-auth.middleware';
import { GlobalParamPublicController } from './controllers/global-param-public.controller';
import { GlobalParamController } from './controllers/global-param.controller';
import { GlobalParamService } from './global-param.service';

@Module({
  providers: [GlobalParamService],
  controllers: [GlobalParamController, GlobalParamPublicController],
})
export class GlobalParamModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(GlobalParamController);
  }
}
