import { HttpStatus, Injectable } from '@nestjs/common';

import { Language } from '../../../common/enums/language.enum';
import { CustomHttpExceptionUtil } from '../../../helpers/custom-http-exection.util';
import { PrismaService } from '../../../libs/prisma/prisma.service';
import { GoodsErrorMessage } from '../../../common/messages/error/goods.message';
import { Prisma } from '@prisma/client';
import { generatePrismaPaginateOption } from '../../../helpers/prisma/generate-prisma-paginate-option';
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
    const { _start, _end, _sort, _order, title_like } = query;

    const whereOption: Prisma.GoodsWhereInput = {
      title: {
        is: {
          [lang]: {
            contains: title_like,
            mode: 'insensitive',
          },
        },
      },
    };

    const [portfolios, total] = await this.prisma.$transaction([
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
      data: portfolios,
      total,
    };
  }
}
