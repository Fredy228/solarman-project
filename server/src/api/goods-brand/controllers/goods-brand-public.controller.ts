import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { type Response } from 'express';
import { JoiPipe } from 'nestjs-joi';

import { GoodsBrandGetManyQueryDto } from '../dto/goods-brand-get-many.query.dto';
import { GoodsBrandPublicService } from '../services/goods-brand-public.service';

@Controller('goods-brand')
export class GoodsBrandPublicController {
  constructor(
    private readonly goodsBrandPublicService: GoodsBrandPublicService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getMany(
    @Query(JoiPipe) query: GoodsBrandGetManyQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data, total } = await this.goodsBrandPublicService.getMany(query);
    res.header('X-Total-Count', total.toString());
    return data;
  }
}
