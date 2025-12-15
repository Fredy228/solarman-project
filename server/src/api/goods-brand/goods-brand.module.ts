import { MiddlewareConsumer, Module } from '@nestjs/common';

import { GoodsBrandService } from './services/goods-brand.service';
import { GoodsBrandPublicService } from './services/goods-brand-public.service';
import { GoodsBrandPublicController } from './controllers/goods-brand-public.controller';
import { GoodsBrandController } from './controllers/goods-brand.controller';
import { ProtectAuthMiddleware } from '../../common/middleware/auth/protect-auth.middleware';

@Module({
  providers: [GoodsBrandService, GoodsBrandPublicService],
  controllers: [GoodsBrandPublicController, GoodsBrandController],
})
export class GoodsBrandModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(GoodsBrandController);
  }
}
