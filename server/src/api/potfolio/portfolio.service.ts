import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PortfolioCreateDto } from './dto/portfolio.create.dto';
import { PrismaService } from '../../libs/prisma/prisma.service';
import { CustomHttpExceptionUtil } from '../../helpers/custom-http-exection.util';
import { FileService } from '../../libs/file/file.service';
import { PortfolioGetManyDto } from './dto/portfolio.get-many.dto';

@Injectable()
export class PortfolioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async getMany(query: PortfolioGetManyDto) {
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
    };

    const dateFilter: Prisma.DateTimeFilter = {};

    if (date) {
      const gte = new Date(date);
      gte.setHours(0, 0, 0, 0);
      const lt = new Date(date);
      lt.setHours(23, 59, 59, 999);
      dateFilter.gte = gte;
      dateFilter.lt = lt;
    }

    if (date_gte) {
      const gte = new Date(date_gte);
      gte.setHours(0, 0, 0, 0);
      dateFilter.gte = gte;
    }

    if (date_lte) {
      const lte = new Date(date_lte);
      lte.setHours(23, 59, 59, 999);
      dateFilter.lte = lte;
    }

    if (Object.keys(dateFilter).length > 0) {
      whereOption.date = dateFilter;
    }

    const [portfolios, total] = await this.prisma.$transaction([
      this.prisma.portfolio.findMany({
        skip: _start,
        take: _end - _start,
        orderBy: {
          [_sort]: _order.toLowerCase(),
        },
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
