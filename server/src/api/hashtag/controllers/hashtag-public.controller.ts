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

import { Lang } from 'src/common/decorator/lang.decorator';
import { Language } from 'src/common/enums/language.enum';
import { HashtagGetManyQueryDto } from '../dto/hashtag-get-many.query.dto';
import { HashtagPublicService } from '../services/hashtag-public.service';

@Controller('hashtag')
export class HashtagPublicController {
  constructor(private readonly hashtagPublicService: HashtagPublicService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getMany(
    @Query(JoiPipe) query: HashtagGetManyQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Lang() lang: Language,
  ) {
    const { data, total } = await this.hashtagPublicService.getMany(
      query,
      lang,
    );
    res.header('X-Total-Count', total.toString());
    return data;
  }
}
