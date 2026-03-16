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
import { BlogGetManyQueryDto } from '../dto/blog-get-many.query.dto';
import { BlogPublicService } from '../services/blog-public.service';

@Controller('blog')
export class BlogPublicController {
  constructor(private readonly blogPublicService: BlogPublicService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getMany(
    @Query(JoiPipe) query: BlogGetManyQueryDto,
    @Res() res: Response,
    @Lang() lang: Language,
  ) {
    const { data, total } = await this.blogPublicService.getMany(query, lang);
    res.header('X-Total-Count', total.toString());
    res.send(data);
  }

  @Get('/tag/:tag')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('tag') tag: string, @Lang() lang: Language) {
    return this.blogPublicService.getOneByTag(tag, lang);
  }
}
