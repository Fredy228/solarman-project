import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { GlobalParamService } from '../global-param.service';

@Controller('global-param')
export class GlobalParamPublicController {
  constructor(private readonly globalParamService: GlobalParamService) {}

  @Get('/:name')
  @HttpCode(HttpStatus.OK)
  async getGlobalParamByName(@Param('name') name: string) {
    return this.globalParamService.getGlobalParamByName(name);
  }
}
