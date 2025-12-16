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
} from '@nestjs/common';
import { GoodsBrand } from '@prisma/client';
import { JoiPipe } from 'nestjs-joi';

import { GoodsBrandService } from '../services/goods-brand.service';
import { GoodsBrandCreateDto } from '../dto/goods-brand.create.dto';
import { Lang } from '../../../common/decorator/lang.decorator';
import { Language } from '../../../common/enums/language.enum';
import { GoodsBrandUpdateDto } from '../dto/goods-brand.update.dto';

@Controller('goods-brand')
export class GoodsBrandController {
  constructor(private readonly goodsBrandService: GoodsBrandService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(JoiPipe) createGoodsBrandDto: GoodsBrandCreateDto,
    @Lang() lang: Language,
  ): Promise<GoodsBrand> {
    return this.goodsBrandService.create(createGoodsBrandDto, lang);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getOne(
    @Param('id') id: string,
    @Lang() lang: Language,
  ): Promise<GoodsBrand> {
    return this.goodsBrandService.getOne(id, lang);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body(JoiPipe) updateGoodsBrandDto: GoodsBrandUpdateDto,
    @Lang() lang: Language,
  ): Promise<GoodsBrand> {
    return this.goodsBrandService.update(id, updateGoodsBrandDto, lang);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @Lang() lang: Language): Promise<void> {
    await this.goodsBrandService.delete(id, lang);
  }
}
