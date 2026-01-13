import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { JoiPipe } from 'nestjs-joi';
import { GlobalParamUpdateDto } from './dto/global-params.dto';
import { GlobalParamService } from './global-param.service';

@Controller('global-param')
export class GlobalParamController {
  constructor(private readonly globalParamService: GlobalParamService) {}

  @Get('/:name')
  @HttpCode(HttpStatus.OK)
  async getGlobalParamByName(@Param('name') name: string) {
    return this.globalParamService.getGlobalParamByName(name);
  }

  @Patch('/')
  @HttpCode(HttpStatus.OK)
  async updateGlobalParam(@Body(JoiPipe) body: GlobalParamUpdateDto) {
    return this.globalParamService.updateGlobalParam(body);
  }
}
