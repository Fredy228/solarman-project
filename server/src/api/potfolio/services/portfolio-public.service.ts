import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../libs/prisma/prisma.service';
import { Language } from '../../../common/enums/language.enum';
import { CustomHttpExceptionUtil } from '../../../helpers/custom-http-exection.util';
import { PortfolioErrorMessage } from '../../../common/messages/error/portfolio.message';
import { generatePrismaDateFilter } from '../../../helpers/prisma/generate-prisma-date-filter';
import { generatePrismaPaginateOption } from '../../../helpers/prisma/generate-prisma-paginate-option';
import { PortfolioGetManyQueryDto } from '../dto/portfolio-get-many.query.dto';

@Injectable()
export class PortfolioPublicService {
  constructor(private readonly prisma: PrismaService) {}

  async getOneByTag(tag: string, lang: Language) {
    const foundPortfolio = await this.prisma.portfolio.findUnique({
      where: {
        tag,
      },
    });
    if (!foundPortfolio)
      throw new CustomHttpExceptionUtil(
        HttpStatus.NOT_FOUND,
        PortfolioErrorMessage[lang].NOT_FOUND,
      );

    const { title, description, ...otherFileds } = foundPortfolio;

    return {
      ...otherFileds,
      title: title[lang],
      description: description[lang],
    };
  }

  async getMany(query: PortfolioGetManyQueryDto, lang: Language) {
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
        is: {
          [lang]: {
            contains: title_like,
            mode: 'insensitive',
          },
        },
      },
      date: generatePrismaDateFilter({ date, date_gte, date_lte }),
      type: query?.type,
      status: query?.status,
    };

    const [portfolios, total] = await this.prisma.$transaction([
      this.prisma.portfolio.findMany({
        ...generatePrismaPaginateOption(_start, _end, _sort, _order),
        where: whereOption,
        select: {
          id: true,
          title: true,
          date: true,
          cover: true,
          type: true,
          status: true,
        },
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
}
