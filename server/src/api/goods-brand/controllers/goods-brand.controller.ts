import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GoodsBrand, Role } from '@prisma/client';
import { JoiPipe } from 'nestjs-joi';

import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Lang } from '../../../common/decorator/lang.decorator';
import { Language } from '../../../common/enums/language.enum';
import { GoodsBrandCreateDto } from '../dto/goods-brand.create.dto';
import { GoodsBrandUpdateDto } from '../dto/goods-brand.update.dto';
import { GoodsBrandService } from '../services/goods-brand.service';

@UseGuards(RolesGuard)
@Controller('goods-brand')
export class GoodsBrandController {
  constructor(private readonly goodsBrandService: GoodsBrandService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async create(
    @Body(JoiPipe) createGoodsBrandDto: GoodsBrandCreateDto,
    @Lang() lang: Language,
  ): Promise<GoodsBrand> {
    return this.goodsBrandService.create(createGoodsBrandDto, lang);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async getOne(
    @Param('id') id: string,
    @Lang() lang: Language,
  ): Promise<GoodsBrand> {
    return this.goodsBrandService.getOne(id, lang);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async update(
    @Param('id') id: string,
    @Body(JoiPipe) updateGoodsBrandDto: GoodsBrandUpdateDto,
    @Lang() lang: Language,
  ): Promise<GoodsBrand> {
    return this.goodsBrandService.update(id, updateGoodsBrandDto, lang);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async delete(@Param('id') id: string, @Lang() lang: Language): Promise<void> {
    await this.goodsBrandService.delete(id, lang);
  }
}
