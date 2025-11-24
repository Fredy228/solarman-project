import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GoodsModule } from './goods/goods.module';
import { PortfolioModule } from './potfolio/portfolio.module';

@Module({
  imports: [AuthModule, UserModule, GoodsModule, PortfolioModule],
})
export class ApiModule {}
