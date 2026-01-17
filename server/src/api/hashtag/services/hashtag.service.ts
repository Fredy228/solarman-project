import { HttpStatus, Injectable } from '@nestjs/common';
import { Hashtag } from '@prisma/client';

import { prepareLocalizedUpdate } from 'src/helpers/prisma/prepare-localized-update';
import { Language } from '../../../common/enums/language.enum';
import { GoodsBrandErrorMessage } from '../../../common/messages/error/goods-brand.message';
import { CustomHttpExceptionUtil } from '../../../helpers/custom-http-exection.util';
import { PrismaService } from '../../../libs/prisma/prisma.service';
import { HashtagCreateDto } from '../dto/hashtag.create.dto';
import { HashtagUpdateDto } from '../dto/hashtag.update.dto';

@Injectable()
export class HashtagService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    { nameRu, nameUk, tag }: HashtagCreateDto,
    lang: Language,
  ): Promise<Hashtag> {
    const existHashtag = await this.prisma.hashtag.findUnique({
      where: {
        tag,
      },
    });
    if (existHashtag)
      throw new CustomHttpExceptionUtil(
        HttpStatus.BAD_REQUEST,
        GoodsBrandErrorMessage[lang].DUPLICATE_NAME,
      );

    return this.prisma.hashtag.create({
      data: {
        name: {
          uk: nameUk,
          ru: nameRu,
        },
        tag,
      },
    });
  }

  async getOne(id: string, lang: Language) {
    const hashtag = await this.prisma.hashtag.findUnique({
      where: { id },
    });
    if (!hashtag)
      throw new CustomHttpExceptionUtil(
        HttpStatus.BAD_REQUEST,
        GoodsBrandErrorMessage[lang].NOT_FOUND,
      );

    return hashtag;
  }

  async update(
    id: string,
    body: HashtagUpdateDto,
    lang: Language,
  ): Promise<Hashtag> {
    await this.getOne(id, lang);
    const updatedHashtag = await this.prisma.hashtag.update({
      where: { id },
      data: {
        tag: body?.tag,
        name: prepareLocalizedUpdate(body?.nameUk, body?.nameRu),
      },
    });
    return updatedHashtag;
  }

  async delete(id: string, lang: Language) {
    await this.getOne(id, lang);
    await this.prisma.hashtag.delete({
      where: { id },
    });
  }
}
