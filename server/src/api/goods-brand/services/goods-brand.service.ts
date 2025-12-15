import { HttpStatus, Injectable } from '@nestjs/common';
import { type GoodsBrand } from '@prisma/client';

import { GoodsBrandCreateDto } from '../dto/goods-brand.create.dto';
import { Language } from '../../../common/enums/language.enum';
import { GoodsBrandErrorMessage } from '../../../common/messages/error/goods-brand.message';
import { PrismaService } from '../../../libs/prisma/prisma.service';
import { CustomHttpExceptionUtil } from '../../../helpers/custom-http-exection.util';

@Injectable()
export class GoodsBrandService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: GoodsBrandCreateDto, lang: Language): Promise<GoodsBrand> {
    const existBrand = await this.prisma.goodsBrand.findUnique({
      where: {
        name: body.name,
      },
    });
    if (existBrand)
      throw new CustomHttpExceptionUtil(
        HttpStatus.BAD_REQUEST,
        GoodsBrandErrorMessage[lang].DUPLICATE_NAME,
      );

    return this.prisma.goodsBrand.create({
      data: {
        name: body.name,
      },
    });
  }
}
