import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { JoiPipe } from 'nestjs-joi';

import { GoodsCategory } from '@prisma/client';
import Joi from 'joi';
import { Lang } from '../../../common/decorator/lang.decorator';
import { Language } from '../../../common/enums/language.enum';
import { GoodsGetManyQueryDto } from '../dto/goods-get-many.query.dto';
import { GoodsPublicService } from '../services/goods-public.service';

@Controller('goods')
export class GoodsPublicController {
  constructor(private readonly goodsPublicService: GoodsPublicService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getMany(
    @Query(JoiPipe) query: GoodsGetManyQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Lang() lang: Language,
  ) {
    const { data, total } = await this.goodsPublicService.getMany(query, lang);
    res.header('X-Total-Count', total.toString());
    return data;
  }

  @Get('/tag/:tag')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('tag') tag: string, @Lang() lang: Language) {
    return this.goodsPublicService.getOneByTag(tag, lang);
  }

  @Get('/filters/:category')
  @HttpCode(HttpStatus.OK)
  async getFiltersByCategory(
    @Param(
      'category',
      new JoiPipe(Joi.string().valid(...Object.values(GoodsCategory))),
    )
    category: GoodsCategory,
  ) {
    return this.goodsPublicService.getFiltersByCategory(category);
  }
}
