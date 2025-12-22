import { Module } from '@nestjs/common';

import { GlobalParamService } from './global-param.service';
import { GlobalParamController } from './global-param.controller';

@Module({
  imports: [],
  providers: [GlobalParamService],
  controllers: [GlobalParamController],
})
export class GlobalParamModule {}
