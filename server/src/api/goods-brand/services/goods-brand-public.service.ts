import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../libs/prisma/prisma.service';
import { GoodsBrandGetManyQueryDto } from '../dto/goods-brand-get-many.query.dto';
import { generatePrismaPaginateOption } from '../../../helpers/prisma/generate-prisma-paginate-option';
import { GoodsBrandErrorMessage } from '../../../common/messages/error/goods-brand.message';
import { CustomHttpExceptionUtil } from '../../../helpers/custom-http-exection.util';
import { Language } from '../../../common/enums/language.enum';

@Injectable()
export class GoodsBrandPublicService {
  constructor(private readonly prisma: PrismaService) {}

  async getMany(query: GoodsBrandGetManyQueryDto) {
    const { _start, _end, _sort, _order, name_like } = query;

    const whereOption: Prisma.GoodsBrandWhereInput = {
      name: {
        contains: name_like,
        mode: 'insensitive',
      },
    };

    const [portfolios, total] = await this.prisma.$transaction([
      this.prisma.goodsBrand.findMany({
        ...generatePrismaPaginateOption(_start, _end, _sort, _order),
        where: whereOption,
      }),
      this.prisma.goodsBrand.count({
        where: whereOption,
      }),
    ]);

    return {
      data: portfolios,
      total,
    };
  }

  async getOne(id: string, lang: Language) {
    const brand = await this.prisma.goodsBrand.findUnique({
      where: { id },
    });
    if (!brand)
      throw new CustomHttpExceptionUtil(
        HttpStatus.BAD_REQUEST,
        GoodsBrandErrorMessage[lang].NOT_FOUND,
      );

    return brand;
  }
}
