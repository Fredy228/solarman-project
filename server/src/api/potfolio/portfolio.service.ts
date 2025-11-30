import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PortfolioCreateDto } from './dto/portfolio.create.dto';
import { PrismaService } from '../../libs/prisma/prisma.service';
import { CustomHttpExceptionUtil } from '../../helpers/custom-http-exection.util';
import { FileService } from '../../libs/file/file.service';
import { PortfolioGetManyQueryDto } from './dto/portfolio-get-many.query.dto';
import { generatePrismaDateFilter } from '../../helpers/prisma/generate-prisma-date-filter';
import { generatePrismaPaginateOption } from '../../helpers/prisma/generate-prisma-paginate-option';

@Injectable()
export class PortfolioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async getMany(query: PortfolioGetManyQueryDto) {
    const {
      _start,
      _end,
      _sort,
      _order,
      title_like,
      date,
      date_gte,
      date_lte,
    } = query;

    const whereOption: Prisma.PortfolioWhereInput = {
      title: {
        contains: title_like,
        mode: 'insensitive',
      },
      date: generatePrismaDateFilter({ date, date_gte, date_lte }),
    };

    const [portfolios, total] = await this.prisma.$transaction([
      this.prisma.portfolio.findMany({
        ...generatePrismaPaginateOption(_start, _end, _sort, _order),
        where: whereOption,
      }),
      this.prisma.portfolio.count({
        where: whereOption,
      }),
    ]);

    return {
      data: portfolios,
      total,
    };
  }

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
