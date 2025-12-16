import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { JoiPipe } from 'nestjs-joi';
import { type Response } from 'express';

import { GoodsBrandPublicService } from '../services/goods-brand-public.service';
import { GoodsBrandGetManyQueryDto } from '../dto/goods-brand-get-many.query.dto';

@Controller('goods-brand')
export class GoodsBrandPublicController {
  constructor(
    private readonly goodsBrandPublicService: GoodsBrandPublicService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getMany(
    @Query(JoiPipe) query: GoodsBrandGetManyQueryDto,
    @Res() res: Response,
  ) {
    const { data, total } = await this.goodsBrandPublicService.getMany(query);
    res.header('X-Total-Count', total.toString());
    res.send(data);
  }
}
