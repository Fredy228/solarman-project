import { HttpStatus, Injectable } from '@nestjs/common';
import { Language as Lang, Prisma } from '@prisma/client';
import { Language } from 'src/common/enums/language.enum';
import { OrderErrorMessage } from 'src/common/messages/error/order.message';
import { CustomHttpExceptionUtil } from 'src/helpers/custom-http-exection.util';
import { generatePrismaDateFilter } from 'src/helpers/prisma/generate-prisma-date-filter';
import { KeyCrmService } from 'src/libs/key-crm/key-crm.service';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { TelegramService } from 'src/libs/telegram/telegram.service';
import { generatePrismaPaginateOption } from '../../../helpers/prisma/generate-prisma-paginate-option';
import { orderTypesMap } from '../data/order-type';
import { PagesMap } from '../data/pages-map';
import type { OrderGetManyQueryDto } from '../dto/order-get-many.query.dto';
import { OrderCreateDto } from '../dto/order.create.dto';
import type { OrderUpdateDto } from '../dto/order.update.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegramService: TelegramService,
    private readonly keyCrmService: KeyCrmService,
  ) {}

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

  async createPublic(body: OrderCreateDto, lang: Language) {
    const order = await this.create(body, lang);

    const phoneDigits = String(body.phone).replace(/\D/g, '');
    const localPhone =
      phoneDigits.startsWith('380') && phoneDigits.length === 12
        ? `0${phoneDigits.slice(3)}`
        : phoneDigits;

    const phoneFormatted =
      localPhone.length === 10
        ? `+38(${localPhone.slice(0, 3)})-${localPhone.slice(3, 6)}-${localPhone.slice(6, 8)}-${localPhone.slice(8, 10)}`
        : body.phone;

    let message = [
      '<b>Нова заявка!</b>\n',
      `<b>Ім'я:</b> ${body.name}`,
      `<b>Телефон:</b> ${phoneFormatted}`,
      `<b>Email:</b> ${body.email || 'Невказано'}`,
      `<b>Тип:</b> ${(body.type && orderTypesMap.get(body.type)) || 'Невідомо'}`,
      `<b>Сторінка:</b> ${body.pageUrl || 'Невідомо'}`,
    ].join('\n');

    this.keyCrmService
      .createLead({
        contact: {
          full_name: body.name,
          phone: phoneFormatted,
          email: body.email || undefined,
        },
        manager_comment: body.notes || undefined,
        utm_source: body?.utmTags?.utm_source || undefined,
        utm_medium: body?.utmTags?.utm_medium || undefined,
        utm_campaign: body?.utmTags?.utm_campaign || undefined,
        utm_content: body?.utmTags?.utm_content || undefined,
        utm_term: body?.utmTags?.utm_term || undefined,
      })
      .catch((err) => {
        this.telegramService.logger.error(
          'Error creating lead in KeyCRM for new order',
          err,
        );
      });

    if (body.notes) message += `\n<b>Примітки</b>: ${body.notes}`;
    if (body.utmTags) {
      const utmTagsString = Object.entries(body.utmTags)
        .map(([key, value]) => `${key} - ${value}`)
        .join('\n');
      message += `\n\n<b>UTM-мітки:</b>\n ${utmTagsString}`;
    }

    this.telegramService.sendMessage(message).catch((err) => {
      this.telegramService.logger.error(
        'Error sending Telegram message for new order',
        err,
      );
    });

    return order;
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
