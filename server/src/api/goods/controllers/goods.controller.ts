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
import { Goods, Role } from '@prisma/client';
import { JoiPipe } from 'nestjs-joi';

import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Lang } from '../../../common/decorator/lang.decorator';
import { Language } from '../../../common/enums/language.enum';
import { FileValidatorPipe } from '../../../common/pipe/validator-file.pipe';
import { GoodsDeleteImageDto } from '../dto/goods-delete-image.dto';
import { GoodsDeleteInstructionsDto } from '../dto/goods-delete-instructions.dto';
import { GoodsCreateDto } from '../dto/goods.create.dto';
import { GoodsUpdateDto } from '../dto/goods.update.dto';
import { GoodsService } from '../services/goods.service';

@UseGuards(RolesGuard)
@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Post('/')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cover', maxCount: 1 },
      { name: 'images', maxCount: 10 },
      { name: 'instructions', maxCount: 5 },
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
        instructions: {
          nullable: true,
          maxSize: 20,
          allowType: ['application'],
          allowFormat: ['pdf', 'x-pdf', 'x-bzpdf', 'x-gzpdf'],
        },
      }),
    )
    files: {
      cover: Array<Express.Multer.File>;
      images?: Array<Express.Multer.File>;
      instructions?: Array<Express.Multer.File>;
    },
    @Body(JoiPipe) body: GoodsCreateDto,
    @Lang() lang: Language,
  ) {
    return this.goodsService.create(
      body,
      lang,
      files.cover,
      files.images,
      files.instructions,
    );
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cover', maxCount: 1 },
      { name: 'images', maxCount: 10 },
      { name: 'instructions', maxCount: 5 },
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
        instructions: {
          nullable: true,
          maxSize: 10,
          allowType: ['application'],
          allowFormat: ['pdf', 'x-pdf', 'x-bzpdf', 'x-gzpdf'],
        },
      }),
    )
    files: {
      cover?: Array<Express.Multer.File>;
      images?: Array<Express.Multer.File>;
      instructions?: Array<Express.Multer.File>;
    },
    @Body(JoiPipe) body: GoodsUpdateDto,
    @Lang() lang: Language,
  ) {
    return this.goodsService.update(
      id,
      body,
      lang,
      files?.cover,
      files?.images,
      files?.instructions,
    );
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async deleteById(
    @Param('id') id: string,
    @Lang() lang: Language,
  ): Promise<void> {
    return this.goodsService.deleteById(id, lang);
  }

  @Delete('/image/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async deleteImageById(
    @Param('id') id: string,
    @Body(JoiPipe) body: GoodsDeleteImageDto,
    @Lang() lang: Language,
  ): Promise<void> {
    await this.goodsService.deleteImageById(id, body.path, lang);
  }

  @Delete('/instructions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async deleteInstructionsById(
    @Param('id') id: string,
    @Body(JoiPipe) body: GoodsDeleteInstructionsDto,
    @Lang() lang: Language,
  ): Promise<void> {
    await this.goodsService.deletePdfInstructionsById(id, body.path, lang);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async getOne(
    @Param('id') id: string,
    @Lang() lang: Language,
  ): Promise<Goods> {
    return this.goodsService.getOne(id, lang);
  }
}
