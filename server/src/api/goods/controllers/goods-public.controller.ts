import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { JoiPipe } from 'nestjs-joi';
import type { Response } from 'express';

import { GoodsPublicService } from '../services/goods-public.service';
import { Lang } from '../../../common/decorator/lang.decorator';
import { Language } from '../../../common/enums/language.enum';
import { GoodsGetManyQueryDto } from '../dto/goods-get-many.query.dto';

@Controller('goods')
export class GoodsPublicController {
  constructor(private readonly goodsPublicService: GoodsPublicService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getMany(
    @Query(JoiPipe) query: GoodsGetManyQueryDto,
    @Res() res: Response,
    @Lang() lang: Language,
  ) {
    const { data, total } = await this.goodsPublicService.getMany(query, lang);
    res.header('X-Total-Count', total.toString());
    res.send(data);
  }

  @Get('/tag/:tag')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('tag') tag: string, @Lang() lang: Language) {
    return this.goodsPublicService.getOneByTag(tag, lang);
  }
}
