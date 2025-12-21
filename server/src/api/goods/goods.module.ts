import { MiddlewareConsumer, Module } from '@nestjs/common';

import { GoodsPublicService } from './services/goods-public-service';
import { GoodsService } from './services/goods.service';
import { GoodsPublicController } from './controllers/goods-public.controller';
import { GoodsController } from './controllers/goods.controller';
import { ProtectAuthMiddleware } from '../../common/middleware/auth/protect-auth.middleware';
import { FileModule } from '../../libs/file/file.module';

@Module({
  imports: [FileModule],
  controllers: [GoodsPublicController, GoodsController],
  providers: [GoodsService, GoodsPublicService],
})
export class GoodsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(GoodsController);
  }
}
