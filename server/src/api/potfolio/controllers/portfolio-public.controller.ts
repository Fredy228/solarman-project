import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { type Response } from 'express';
import { JoiPipe } from 'nestjs-joi';

import { Lang } from '../../../common/decorator/lang.decorator';
import { Language } from '../../../common/enums/language.enum';
import { PortfolioGetManyQueryDto } from '../dto/portfolio-get-many.query.dto';
import { PortfolioPublicService } from '../services/portfolio-public.service';

@Controller('portfolio')
export class PortfolioPublicController {
  constructor(
    private readonly portfolioPublicService: PortfolioPublicService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getMany(
    @Query(JoiPipe) query: PortfolioGetManyQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Lang() lang: Language,
  ) {
    const { data, total } = await this.portfolioPublicService.getMany(
      query,
      lang,
    );
    res.header('X-Total-Count', total.toString());
    return data;
  }

  @Get('/tag/:tag')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('tag') tag: string, @Lang() lang: Language) {
    return this.portfolioPublicService.getOneByTag(tag, lang);
  }
}
