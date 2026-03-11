import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { GlobalParamModule } from './global-param/global-param.module';
import { GoodsBrandModule } from './goods-brand/goods-brand.module';
import { GoodsModule } from './goods/goods.module';
import { HashtagModule } from './hashtag/hashtag.module';
import { OrderModule } from './order/order.module';
import { PortfolioModule } from './potfolio/portfolio.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    GlobalParamModule,
    UserModule,
    PortfolioModule,
    GoodsModule,
    GoodsBrandModule,
    UploadModule,
    HashtagModule,
    OrderModule,
    BlogModule,
  ],
})
export class ApiModule {}
