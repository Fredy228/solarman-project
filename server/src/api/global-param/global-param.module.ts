import { Module } from '@nestjs/common';

import { GlobalParamController } from './global-param.controller';
import { GlobalParamService } from './global-param.service';

@Module({
  providers: [GlobalParamService],
  controllers: [GlobalParamController],
})
export class GlobalParamModule {}
