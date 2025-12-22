import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

import { FileService } from '../../libs/file/file.service';

@Injectable()
export class UploadService {
  constructor(private readonly fileService: FileService) {}

  async saveImage(file: Express.Multer.File): Promise<{ url: string }> {
    const metadata = await sharp(file.buffer).metadata();

    const coverPath = await this.fileService.saveImage({
      file,
      filePath: ['static', 'uploads'],
      format: 'webp',
    });

    return {
      url: `${coverPath}?w=${metadata.width}&h=${metadata.height}`,
    };
  }
}
