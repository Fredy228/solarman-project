import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GoodsModule } from './goods/goods.module';
import { PortfolioModule } from './potfolio/portfolio.module';
import { GoodsBrandModule } from './goods-brand/goods-brand.module';
import { GlobalParamModule } from './global-param/global-param.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    AuthModule,
    GlobalParamModule,
    UserModule,
    PortfolioModule,
    GoodsModule,
    GoodsBrandModule,
    UploadModule,
  ],
})
export class ApiModule {}
