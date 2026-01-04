import { HttpStatus, Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { generatePrismaIntFilter } from 'src/helpers/prisma/generate-prisma-int-filter';
import { Language } from '../../../common/enums/language.enum';
import { GoodsErrorMessage } from '../../../common/messages/error/goods.message';
import { CustomHttpExceptionUtil } from '../../../helpers/custom-http-exection.util';
import { generatePrismaPaginateOption } from '../../../helpers/prisma/generate-prisma-paginate-option';
import { PrismaService } from '../../../libs/prisma/prisma.service';
import { GoodsGetManyQueryDto } from '../dto/goods-get-many.query.dto';

@Injectable()
export class GoodsPublicService {
  constructor(private readonly prisma: PrismaService) {}

  async getOneByTag(tag: string, lang: Language) {
    const foundGoods = await this.prisma.goods.findUnique({
      where: {
        tag,
      },
    });
    if (!foundGoods)
      throw new CustomHttpExceptionUtil(
        HttpStatus.NOT_FOUND,
        GoodsErrorMessage[lang].NOT_FOUND,
      );

    const { title, description, ...otherFileds } = foundGoods;

    return {
      ...otherFileds,
      title: title[lang],
      description: description[lang],
    };
  }

  async getMany(query: GoodsGetManyQueryDto, lang: Language) {
    const {
      _start,
      _end,
      _sort,
      _order,
      title_like,
      price_gte,
      price_lte,
      discountPrice_gte,
      discountPrice_lte,
      ...simpleFilters
    } = query;

    const whereOption: Prisma.GoodsWhereInput = {
      title: {
        is: {
          [lang]: {
            contains: title_like,
            mode: 'insensitive',
          },
        },
      },
      price: generatePrismaIntFilter({
        value_gte: price_gte,
        value_lte: price_lte,
      }),
      discountPrice: generatePrismaIntFilter({
        value_gte: discountPrice_gte,
        value_lte: discountPrice_lte,
      }),
      ...simpleFilters,
    };

    const [goods, total] = await this.prisma.$transaction([
      this.prisma.goods.findMany({
        ...generatePrismaPaginateOption(_start, _end, _sort, _order),
        where: whereOption,
        select: {
          id: true,
          cover: true,
          title: true,
          country: true,
          price: true,
          discountPrice: true,
          badge: true,
          category: true,
          status: true,
          brand: {
            select: {
              name: true,
            },
          },
        },
      }),
      this.prisma.goods.count({
        where: whereOption,
      }),
    ]);

    return {
      data: goods,
      total,
    };
  }
}
