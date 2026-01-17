import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { Language } from 'src/common/enums/language.enum';
import { generatePrismaPaginateOption } from '../../../helpers/prisma/generate-prisma-paginate-option';
import { PrismaService } from '../../../libs/prisma/prisma.service';
import { HashtagGetManyQueryDto } from '../dto/hashtag-get-many.query.dto';

@Injectable()
export class HashtagPublicService {
  constructor(private readonly prisma: PrismaService) {}

  async getMany(query: HashtagGetManyQueryDto, lang: Language) {
    const { _start, _end, _sort, _order, name_like } = query;

    const whereOption: Prisma.HashtagWhereInput = {
      name: {
        is: {
          [lang]: {
            contains: name_like,
            mode: 'insensitive',
          },
        },
      },
    };

    const [hashtags, total] = await this.prisma.$transaction([
      this.prisma.hashtag.findMany({
        ...generatePrismaPaginateOption(_start, _end, _sort, _order),
        where: whereOption,
      }),
      this.prisma.hashtag.count({
        where: whereOption,
      }),
    ]);

    return {
      data: hashtags.map((hashtag) => ({
        ...hashtag,
        name: hashtag.name[lang],
      })),
      total,
    };
  }
}
