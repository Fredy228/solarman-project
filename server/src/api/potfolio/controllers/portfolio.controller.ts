import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JoiPipe } from 'nestjs-joi';
import { FileValidatorPipe } from '../../../common/pipe/validator-file.pipe';
import { PortfolioCreateDto } from '../dto/portfolio.create.dto';
import { PortfolioService } from '../portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post('/')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cover', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
  )
  async create(
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

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id') id: string): Promise<void> {
    return this.portfolioService.deleteById(id);
  }
}
