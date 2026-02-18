import { HttpStatus, Injectable } from '@nestjs/common';
import { Language as Lang, Prisma } from '@prisma/client';
import { Language } from 'src/common/enums/language.enum';
import { OrderErrorMessage } from 'src/common/messages/error/order.message';
import { CustomHttpExceptionUtil } from 'src/helpers/custom-http-exection.util';
import { generatePrismaDateFilter } from 'src/helpers/prisma/generate-prisma-date-filter';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { generatePrismaPaginateOption } from '../../../helpers/prisma/generate-prisma-paginate-option';
import { PagesMap } from '../data/pages-map';
import type { OrderGetManyQueryDto } from '../dto/order-get-many.query.dto';
import { OrderCreateDto } from '../dto/order.create.dto';
import type { OrderUpdateDto } from '../dto/order.update.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: OrderCreateDto, lang: Language) {
    const { pageUrl, ...otherFields } = body;

    const data: Prisma.OrderCreateInput = {
      ...otherFields,
      lang: lang.toUpperCase() as Lang,
    };

    if (pageUrl) {
      const pageId = Array.from(PagesMap.keys()).find((key) => {
        if (pageUrl.replace('uk', '').replace('ru', '') === PagesMap.get(key)) {
          return true;
        }
        return pageUrl.includes(PagesMap.get(key)!);
      });
      if (pageId) data.pageId = pageId;
    }

    return this.prisma.order.create({
      data,
    });
  }

  async update(id: string, body: OrderUpdateDto, lang: Language) {
    await this.getOneById(id, lang);

    return this.prisma.order.update({
      where: { id },
      data: body,
    });
  }

  async getOneById(id: string, lang: Language) {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    });

    if (!order)
      throw new CustomHttpExceptionUtil(
        HttpStatus.NOT_FOUND,
        OrderErrorMessage[lang].NOT_FOUND,
      );

    return order;
  }

  async getAll(query: OrderGetManyQueryDto) {
    const {
      _start,
      _end,
      _sort,
      _order,
      createdAt,
      createdAt_gte,
      createdAt_lte,
      updatedAt,
      updatedAt_gte,
      updatedAt_lte,
      ...filters
    } = query;

    const whereOption: Prisma.OrderWhereInput = {
      email: {
        contains: filters.email_like,
        mode: 'insensitive',
      },
      name: {
        contains: filters.name_like,
        mode: 'insensitive',
      },
      phone: {
        contains: filters.phone_like,
        mode: 'default',
      },
      notes: {
        contains: filters.notes_like,
        mode: 'insensitive',
      },
      lang: filters.lang,
      type: filters.type,
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
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        ...generatePrismaPaginateOption(_start, _end, _sort, _order),
        where: whereOption,
      }),
      this.prisma.order.count({
        where: whereOption,
      }),
    ]);

    return { data, total };
  }

  async deleteById(id: string, lang: Language) {
    const order = await this.getOneById(id, lang);

    await this.prisma.order.delete({
      where: {
        id: order.id,
      },
    });

    return order;
  }
}
