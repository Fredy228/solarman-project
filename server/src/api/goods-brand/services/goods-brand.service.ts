import { HttpStatus, Injectable } from '@nestjs/common';
import { type GoodsBrand } from '@prisma/client';

import { GoodsBrandCreateDto } from '../dto/goods-brand.create.dto';
import { Language } from '../../../common/enums/language.enum';
import { GoodsBrandErrorMessage } from '../../../common/messages/error/goods-brand.message';
import { PrismaService } from '../../../libs/prisma/prisma.service';
import { CustomHttpExceptionUtil } from '../../../helpers/custom-http-exection.util';
import { GoodsBrandUpdateDto } from '../dto/goods-brand.update.dto';

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

  async update(
    id: string,
    body: GoodsBrandUpdateDto,
    lang: Language,
  ): Promise<GoodsBrand> {
    await this.getOne(id, lang);
    const updatedBrand = await this.prisma.goodsBrand.update({
      where: { id },
      data: {
        name: body.name,
      },
    });
    return updatedBrand;
  }

  async delete(id: string, lang: Language) {
    await this.getOne(id, lang);
    await this.prisma.goodsBrand.delete({
      where: { id },
    });
  }
}
