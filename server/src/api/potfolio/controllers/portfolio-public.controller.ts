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
import { type Response } from 'express';

import { PortfolioGetManyQueryDto } from '../dto/portfolio-get-many.query.dto';
import { Language } from '../../../common/enums/language.enum';
import { Lang } from '../../../common/decorator/lang.decorator';
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
    @Res() res: Response,
    @Lang() lang: Language,
  ) {
    const { data, total } = await this.portfolioPublicService.getMany(
      query,
      lang,
    );
    res.header('X-Total-Count', total.toString());
    res.send(data);
  }

  @Get('/tag/:tag')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('tag') tag: string, @Lang() lang: Language) {
    return this.portfolioPublicService.getOneByTag(tag, lang);
  }
}
