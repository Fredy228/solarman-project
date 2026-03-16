import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JoiPipe } from 'nestjs-joi';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { GlobalParamUpdateDto } from './dto/global-params.dto';
import { GlobalParamService } from './global-param.service';

@UseGuards(RolesGuard)
@Controller('global-param')
export class GlobalParamController {
  constructor(private readonly globalParamService: GlobalParamService) {}

  @Get('/:name')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async getGlobalParamByName(@Param('name') name: string) {
    return this.globalParamService.getGlobalParamByName(name);
  }

  @Patch('/')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async updateGlobalParam(@Body(JoiPipe) body: GlobalParamUpdateDto) {
    return this.globalParamService.updateGlobalParam(body);
  }
}
