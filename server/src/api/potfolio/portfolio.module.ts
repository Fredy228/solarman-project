import { MiddlewareConsumer, Module } from '@nestjs/common';

import { PortfolioService } from './services/portfolio.service';
import { PortfolioController } from './controllers/portfolio.controller';
import { FileModule } from '../../libs/file/file.module';
import { PortfolioPublicController } from './controllers/portfolio-public.controller';
import { ProtectAuthMiddleware } from '../../common/middleware/auth/protect-auth.middleware';
import { PortfolioPublicService } from './services/portfolio-public.service';

@Module({
  imports: [FileModule],
  controllers: [PortfolioController, PortfolioPublicController],
  providers: [PortfolioService, PortfolioPublicService],
})
export class PortfolioModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(PortfolioController);
  }
}
