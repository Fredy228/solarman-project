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
import { Blog, Role } from '@prisma/client';
import { JoiPipe } from 'nestjs-joi';

import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Lang } from '../../../common/decorator/lang.decorator';
import { Language } from '../../../common/enums/language.enum';
import { FileValidatorPipe } from '../../../common/pipe/validator-file.pipe';
import { BlogCreateDto } from '../dto/blog.create.dto';
import { BlogUpdateDto } from '../dto/blog.update.dto';
import { BlogService } from '../services/blog.service';

@UseGuards(RolesGuard)
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('/')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'cover', maxCount: 1 }]))
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
      }),
    )
    files: {
      cover: Array<Express.Multer.File>;
      images?: Array<Express.Multer.File>;
    },
    @Body(JoiPipe) body: BlogCreateDto,
    @Lang() lang: Language,
  ) {
    return this.blogService.create(body, files, lang);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'cover', maxCount: 1 }]))
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
      }),
    )
    files: {
      cover?: Array<Express.Multer.File>;
      images?: Array<Express.Multer.File>;
    },
    @Body(JoiPipe) body: BlogUpdateDto,
    @Lang() lang: Language,
  ) {
    return this.blogService.update(id, body, files, lang);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async deleteById(
    @Param('id') id: string,
    @Lang() lang: Language,
  ): Promise<void> {
    return this.blogService.deleteById(id, lang);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async getOne(@Param('id') id: string, @Lang() lang: Language): Promise<Blog> {
    return this.blogService.getOne(id, lang);
  }
}
