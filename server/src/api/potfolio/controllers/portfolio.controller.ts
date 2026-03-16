import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Portfolio, Role } from '@prisma/client';
import { JoiPipe } from 'nestjs-joi';

import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Lang } from '../../../common/decorator/lang.decorator';
import { Language } from '../../../common/enums/language.enum';
import { FileValidatorPipe } from '../../../common/pipe/validator-file.pipe';
import { PortfolioDeleteImageDto } from '../dto/portfolio-delete-image.dto';
import { PortfolioCreateDto } from '../dto/portfolio.create.dto';
import { PortfolioUpdateDto } from '../dto/portfolio.update.dto';
import { PortfolioService } from '../services/portfolio.service';

@UseGuards(RolesGuard)
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
  @Roles(Role.ADMIN, Role.MODERATOR)
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
          nullable: true,
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

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cover', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
  )
  @Roles(Role.ADMIN, Role.MODERATOR)
  async update(
    @Param('id') id: string,
    @UploadedFiles(
      new FileValidatorPipe({
        cover: {
          nullable: true,
          maxSize: 10,
          allowType: ['image'],
          allowFormat: ['png', 'jpg', 'jpeg', 'webp'],
        },
        images: {
          nullable: true,
          maxSize: 10,
          allowType: ['image'],
          allowFormat: ['png', 'jpg', 'jpeg', 'webp'],
        },
      }),
    )
    files: {
      cover?: Array<Express.Multer.File>;
      images?: Array<Express.Multer.File>;
    },
    @Body(JoiPipe) body: PortfolioUpdateDto,
    @Lang() lang: Language,
  ) {
    return this.portfolioService.update(id, body, files, lang);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async deleteById(
    @Param('id') id: string,
    @Lang() lang: Language,
  ): Promise<void> {
    return this.portfolioService.deleteById(id, lang);
  }

  @Delete('/image/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async deleteImageById(
    @Param('id') id: string,
    @Body(JoiPipe) body: PortfolioDeleteImageDto,
    @Lang() lang: Language,
  ): Promise<void> {
    await this.portfolioService.deleteImageById(id, body.path, lang);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async getOne(
    @Param('id') id: string,
    @Lang() lang: Language,
  ): Promise<Portfolio> {
    return this.portfolioService.getOne(id, lang);
  }
}
