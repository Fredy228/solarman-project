import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, ProductStatus } from '@prisma/client';

import { BlogErrorMessage } from 'src/common/messages/error/blog.message';
import { Language } from '../../../common/enums/language.enum';
import { CustomHttpExceptionUtil } from '../../../helpers/custom-http-exection.util';
import { generatePrismaDateFilter } from '../../../helpers/prisma/generate-prisma-date-filter';
import { generatePrismaPaginateOption } from '../../../helpers/prisma/generate-prisma-paginate-option';
import { PrismaService } from '../../../libs/prisma/prisma.service';
import { BlogGetManyQueryDto } from '../dto/blog-get-many.query.dto';

@Injectable()
export class BlogPublicService {
  constructor(private readonly prisma: PrismaService) {}

  async getOneByTag(tag: string, lang: Language) {
    const foundBlog = await this.prisma.blog.findUnique({
      where: {
        tag,
        status: ProductStatus.PUBLISHED,
      },
    });
    if (!foundBlog)
      throw new CustomHttpExceptionUtil(
        HttpStatus.NOT_FOUND,
        BlogErrorMessage[lang].NOT_FOUND,
      );

    return foundBlog;
  }

  async getMany(query: BlogGetManyQueryDto, lang: Language) {
    const {
      _start,
      _end,
      _sort,
      _order,
      title_like,
      createdAt,
      createdAt_gte,
      createdAt_lte,
      updatedAt,
      updatedAt_gte,
      updatedAt_lte,
    } = query;

    const whereOption: Prisma.BlogWhereInput = {
      title: {
        is: {
          [lang]: {
            contains: title_like,
            mode: 'insensitive',
          },
        },
      },
      createdAt: generatePrismaDateFilter({
        date: createdAt,
        date_gte: createdAt_gte,
        date_lte: createdAt_lte,
      }),
      updatedAt: generatePrismaDateFilter({
        date: updatedAt,
        date_gte: updatedAt_gte,
        date_lte: updatedAt_lte,
      }),
      status: query?.status,
    };

    const [blogs, total] = await this.prisma.$transaction([
      this.prisma.blog.findMany({
        ...generatePrismaPaginateOption(_start, _end, _sort, _order),
        where: whereOption,
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          cover: true,
          status: true,
          tag: true,
        },
      }),
      this.prisma.blog.count({
        where: whereOption,
      }),
    ]);

    return {
      data: blogs,
      total,
    };
  }
}
