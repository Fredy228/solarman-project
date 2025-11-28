import { Module } from '@nestjs/common';

import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { FileModule } from '../../libs/file/file.module';

@Module({
  imports: [FileModule],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
