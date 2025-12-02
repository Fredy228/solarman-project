import { HttpStatus, Injectable } from '@nestjs/common';
import { Portfolio, Prisma } from '@prisma/client';
import { ObjectId } from 'bson';

import { PortfolioCreateDto } from './dto/portfolio.create.dto';
import { PrismaService } from '../../libs/prisma/prisma.service';
import { CustomHttpExceptionUtil } from '../../helpers/custom-http-exection.util';
import { FileService } from '../../libs/file/file.service';
import { PortfolioGetManyQueryDto } from './dto/portfolio-get-many.query.dto';
import { generatePrismaDateFilter } from '../../helpers/prisma/generate-prisma-date-filter';
import { generatePrismaPaginateOption } from '../../helpers/prisma/generate-prisma-paginate-option';
import { PortfolioUpdateDto } from './dto/portfolio.update.dto';
import { PortfolioErrorMessage } from '../../common/messages/error/portfolio.message';

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

    const newId = new ObjectId().toString();

    const coverPath = await this.fileService.saveImage({
      file: files.cover[0],
      filePath: ['static', 'portfolio', newId],
      format: 'webp',
    });

    const imagesPath = await this.fileService.saveImageMany(
      files?.images || [],
      {
        filePath: ['static', 'portfolio', newId],
        format: 'webp',
      },
    );

    return this.prisma.portfolio.create({
      data: {
        ...body,
        id: newId,
        cover: coverPath,
        images: imagesPath,
      },
    });
  }

  async getOne(id: string): Promise<Portfolio> {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: {
        id,
      },
    });

    if (!portfolio)
      throw new CustomHttpExceptionUtil(
        HttpStatus.NOT_FOUND,
        PortfolioErrorMessage.NOT_FOUND,
      );

    return portfolio;
  }

  async update(
    id: string,
    body: PortfolioUpdateDto,
    files: {
      cover?: Array<Express.Multer.File>;
      images?: Array<Express.Multer.File>;
    },
  ) {
    const portfolio = await this.getOne(id);

    const updatedBody = { ...body };

    if (files?.cover && files.cover[0]) {
      updatedBody['cover'] = await this.fileService.saveImage({
        file: files.cover[0],
        filePath: ['static', 'portfolio', portfolio.id],
        format: 'webp',
      });

      this.fileService.deleteFiles([portfolio.cover]);
    }

    if (files?.images && files.images.length) {
      const imagesPath = await this.fileService.saveImageMany(
        files.images || [],
        {
          filePath: ['static', 'portfolio', portfolio.id],
          format: 'webp',
        },
      );
      updatedBody['images'] = portfolio.images.concat(imagesPath);
    }

    return this.prisma.portfolio.update({
      where: {
        id,
      },
      data: updatedBody,
    });
  }

  async deleteById(id: string): Promise<void> {
    const portfolio = await this.getOne(id);

    this.fileService.deleteFolder(['static', 'portfolio', portfolio.id]);
    await this.prisma.portfolio.delete({ where: { id } });
  }

  async deleteImageById(id: string, image: string): Promise<void> {
    const portfolio = await this.getOne(id);

    const images = portfolio.images.filter((item) => item !== image);
    this.fileService.deleteFiles([image]);

    await this.prisma.portfolio.update({
      where: { id },
      data: {
        images,
      },
    });
  }
}
