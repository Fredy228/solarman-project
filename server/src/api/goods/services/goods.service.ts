import { HttpStatus, Injectable } from '@nestjs/common';
import { ObjectId } from 'bson';
import { Prisma } from '@prisma/client';
import { Block } from '@blocknote/core';

import { FileService } from '../../../libs/file/file.service';
import { PrismaService } from '../../../libs/prisma/prisma.service';
import { GoodsCreateDto } from '../dto/goods.create.dto';
import { CustomHttpExceptionUtil } from '../../../helpers/custom-http-exection.util';
import { Language } from '../../../common/enums/language.enum';
import { GoodsErrorMessage } from '../../../common/messages/error/goods.message';
import { extractImageUrls } from '../../../helpers/extract-image-urls.util';
import { replaceImageUrls } from '../../../helpers/replace-image-urls.util';

@Injectable()
export class GoodsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async create(
    body: GoodsCreateDto,
    lang: Language,
    cover: Array<Express.Multer.File>,
    pdfFiles?: Array<Express.Multer.File>,
  ) {
    const existGoods = await this.prisma.goods.findUnique({
      where: {
        tag: body.tag,
      },
      select: {
        id: true,
      },
    });
    if (existGoods)
      throw new CustomHttpExceptionUtil(
        HttpStatus.BAD_REQUEST,
        GoodsErrorMessage[lang].DUPLICATE_TAG,
      );

    const newId = new ObjectId().toString();

    const {
      titleUk,
      titleRu,
      descriptionRu,
      descriptionUk,
      specs,
      brand,
      ...otherFields
    } = body;
    const descriptionUkParsed = JSON.parse(descriptionUk) as Block[];
    const descriptionRuParsed = JSON.parse(descriptionRu) as Block[];

    const descriptionImageUrls: string[] = [
      ...new Set([
        ...extractImageUrls(descriptionUkParsed),
        ...extractImageUrls(descriptionRuParsed),
      ]),
    ];

    const urlReplaceMap: Record<string, string> = {};
    await Promise.all(
      descriptionImageUrls.map(async (url) => {
        if (!url) return;
        const newUrl = await this.fileService.moveFile(url, [
          'static',
          'goods',
          newId,
        ]);
        if (!newUrl) return;
        urlReplaceMap[url] = newUrl;
      }),
    );

    const descriptionUkUpdated = replaceImageUrls(
      descriptionUkParsed,
      urlReplaceMap,
    );
    const descriptionRuUpdated = replaceImageUrls(
      descriptionRuParsed,
      urlReplaceMap,
    );

    const coverPath = await this.fileService.saveImage({
      file: cover[0],
      filePath: ['static', 'goods', newId],
      format: 'webp',
    });

    const data: Prisma.GoodsCreateInput = {
      ...otherFields,
      id: newId,
      title: {
        uk: titleUk,
        ru: titleRu,
      },
      description: {
        uk: JSON.stringify(descriptionUkUpdated),
        ru: JSON.stringify(descriptionRuUpdated),
      },
      cover: coverPath,
      specs: specs as Prisma.InputJsonValue,
      brand: brand
        ? {
            connect: {
              id: brand,
            },
          }
        : undefined,
    };

    if (pdfFiles) {
      data.instructions = await this.fileService.saveFileMany(
        pdfFiles,
        'static',
        'goods',
        newId,
      );
    }

    return this.prisma.goods.create({
      data,
    });
  }

  async getOne(id: string, lang: Language) {
    const goods = await this.prisma.goods.findUnique({
      where: { id },
    });
    if (!goods)
      throw new CustomHttpExceptionUtil(
        HttpStatus.NOT_FOUND,
        GoodsErrorMessage[lang].NOT_FOUND,
      );
    return goods;
  }

  async update(
    id: string,
    body: GoodsCreateDto,
    lang: Language,
    cover: Array<Express.Multer.File>,
    pdfFiles?: Array<Express.Multer.File>,
  ) {
    const goods = await this.getOne(id, lang);
  }

  async delete(id: string, lang: Language) {
    const goods = await this.getOne(id, lang);
    await this.prisma.goods.delete({ where: { id: goods.id } });
  }
}
