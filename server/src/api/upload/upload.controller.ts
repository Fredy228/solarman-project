import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { FileValidatorPipe } from 'src/common/pipe/validator-file.pipe';
import { UploadService } from './upload.service';

@UseGuards(RolesGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('/image')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @Roles(Role.ADMIN, Role.MODERATOR)
  async saveImage(
    @UploadedFiles(
      new FileValidatorPipe({
        image: {
          nullable: false,
          maxSize: 10,
          allowType: ['image'],
          allowFormat: ['png', 'jpg', 'jpeg', 'webp'],
        },
      }),
    )
    files: {
      image: Array<Express.Multer.File>;
    },
  ) {
    return this.uploadService.saveImage(files.image[0]);
  }
}
