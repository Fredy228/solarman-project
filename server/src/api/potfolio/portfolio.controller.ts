import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JoiPipe } from 'nestjs-joi';
import { type Response } from 'express';

import { type ProtectReqType } from '../../common/types/request.type';
import { FileValidatorPipe } from '../../common/pipe/validator-file.pipe';
import { PortfolioCreateDto } from './dto/portfolio.create.dto';
import { PortfolioService } from './portfolio.service';
import { PortfolioGetManyDto } from './dto/portfolio.get-many.dto';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getMany(
    @Query(JoiPipe) query: PortfolioGetManyDto,
    @Res() res: Response,
  ) {
    const { data, total } = await this.portfolioService.getMany(query);
    res.header('X-Total-Count', total.toString());
    res.send(data);
  }

  @Post('/')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cover', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
  )
  async create(
    @Req() req: ProtectReqType,
    @UploadedFiles(
      new FileValidatorPipe({
        cover: {
          nullable: false,
          maxSize: 10,
          allowType: ['image'],
          allowFormat: ['png', 'jpg', 'jpeg', 'webp'],
        },
        images: {
          nullable: false,
          maxSize: 10,
          allowType: ['image'],
          allowFormat: ['png', 'jpg', 'jpeg', 'webp'],
        },
      }),
    )
    files: {
      cover: Array<Express.Multer.File>;
      images?: Array<Express.Multer.File>;
    },
    @Body(JoiPipe) body: PortfolioCreateDto,
  ) {
    return this.portfolioService.create(body, files);
  }
}
