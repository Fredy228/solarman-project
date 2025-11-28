import { HttpStatus, Injectable } from '@nestjs/common';

import { PortfolioCreateDto } from './dto/portfolio.create.dto';
import { PrismaService } from '../../libs/prisma/prisma.service';
import { CustomHttpExceptionUtil } from '../../helpers/custom-http-exection.util';
import { FileService } from '../../libs/file/file.service';

@Injectable()
export class PortfolioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async create(
    body: PortfolioCreateDto,
    files: {
      cover: Array<Express.Multer.File>;
      images?: Array<Express.Multer.File>;
    },
  ) {
    const existPortfolio = await this.prisma.portfolio.findUnique({
      where: {
        tag: body.tag,
      },
      select: {
        id: true,
      },
    });
    if (existPortfolio)
      throw new CustomHttpExceptionUtil(
        HttpStatus.BAD_REQUEST,
        `Портфоліо з тегом ${body.tag} вже існує`,
      );

    const coverPath = await this.fileService.saveImage({
      file: files.cover[0],
      filePath: ['static', 'portfolio', body.tag],
      format: 'webp',
    });

    const imagesPath = await this.fileService.saveImageMany(
      files.images || [],
      {
        filePath: ['static', 'portfolio', body.tag],
        format: 'webp',
      },
    );

    return this.prisma.portfolio.create({
      data: {
        ...body,
        cover: coverPath,
        images: imagesPath,
      },
    });
  }
}
