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
import { prepareLocalizedUpdate } from '../../../helpers/prisma/prepare-localized-update';
import { GoodsUpdateDto } from '../dto/goods.update.dto';

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
    images?: Array<Express.Multer.File>,
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

    if (images) {
      data.images = await this.fileService.saveImageMany(images || [], {
        filePath: ['static', 'goods', newId],
        format: 'webp',
      });
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
    body: GoodsUpdateDto,
    lang: Language,
    cover?: Array<Express.Multer.File>,
    images?: Array<Express.Multer.File>,
    pdfFiles?: Array<Express.Multer.File>,
  ) {
    const goods = await this.getOne(id, lang);
    const {
      titleRu,
      titleUk,
      descriptionRu,
      descriptionUk,
      specs,
      brand,
      ...otherFields
    } = body;

    const updatedBody: Prisma.GoodsUpdateInput = {
      ...otherFields,
      title: prepareLocalizedUpdate(titleUk, titleRu),
    };

    if (specs) {
      updatedBody.specs = {
        ...(goods.specs ? (goods.specs as Record<string, unknown>) : {}),
        ...specs,
      } as Prisma.InputJsonValue;
    }

    if (brand) {
      updatedBody.brand = {
        connect: {
          id: brand,
        },
      };
    }

    if (cover && cover[0]) {
      updatedBody['cover'] = await this.fileService.saveImage({
        file: cover[0],
        filePath: ['static', 'goods', goods.id],
        format: 'webp',
      });
      this.fileService.deleteFiles([goods.cover]);
    }

    if (images && images.length) {
      const imagesPath = await this.fileService.saveImageMany(images || [], {
        filePath: ['static', 'goods', goods.id],
        format: 'webp',
      });
      updatedBody.images = goods.images.concat(imagesPath);
    }

    if (pdfFiles) {
      const newInstructions = await this.fileService.saveFileMany(
        pdfFiles,
        'static',
        'goods',
        goods.id,
      );
      updatedBody.instructions = goods.instructions.concat(newInstructions);
    }

    if (descriptionUk || descriptionRu) {
      const descriptionUkParsed = descriptionUk
        ? (JSON.parse(descriptionUk) as Block[])
        : null;
      const descriptionRuParsed = descriptionRu
        ? (JSON.parse(descriptionRu) as Block[])
        : null;

      const descriptionImageUrlsCurrent: string[] = [
        ...new Set([
          ...extractImageUrls(JSON.parse(goods.description.uk) as Block[]),
          ...extractImageUrls(JSON.parse(goods.description.ru) as Block[]),
        ]),
      ];
      const descriptionImageUrlsNew: string[] = [
        ...new Set([
          ...(descriptionUkParsed ? extractImageUrls(descriptionUkParsed) : []),
          ...(descriptionRuParsed ? extractImageUrls(descriptionRuParsed) : []),
        ]),
      ];

      const addedImages = descriptionImageUrlsNew.filter(
        (url) => !descriptionImageUrlsCurrent.includes(url),
      );
      const removedImages = descriptionImageUrlsCurrent.filter(
        (url) => !descriptionImageUrlsNew.includes(url),
      );

      const urlReplaceMap: Record<string, string> = {};
      await Promise.all(
        addedImages.map(async (url) => {
          if (!url) return;
          const newUrl = await this.fileService.moveFile(url, [
            'static',
            'goods',
            goods.id,
          ]);
          if (!newUrl) return;
          urlReplaceMap[url] = newUrl;
        }),
      );
      this.fileService.deleteFiles(removedImages);

      let descriptionUkUpdated: undefined | Block[] = undefined;
      let descriptionRuUpdated: undefined | Block[] = undefined;
      if (descriptionUk && descriptionUkParsed)
        descriptionUkUpdated = replaceImageUrls(
          descriptionUkParsed,
          urlReplaceMap,
        );
      if (descriptionRu && descriptionRuParsed)
        descriptionRuUpdated = replaceImageUrls(
          descriptionRuParsed,
          urlReplaceMap,
        );
      updatedBody.description = prepareLocalizedUpdate(
        JSON.stringify(descriptionUkUpdated),
        JSON.stringify(descriptionRuUpdated),
      );
    }

    return this.prisma.goods.update({
      where: {
        id,
      },
      data: updatedBody,
    });
  }

  async deleteById(id: string, lang: Language) {
    const goods = await this.getOne(id, lang);
    this.fileService.deleteFolder(['static', 'goods', goods.id]);
    await this.prisma.goods.delete({ where: { id: goods.id } });
  }

  async deleteImageById(
    id: string,
    imagePath: string,
    lang: Language,
  ): Promise<void> {
    const goods = await this.getOne(id, lang);

    const filteredImages = goods.images.filter((item) => item !== imagePath);
    this.fileService.deleteFiles([imagePath]);

    await this.prisma.goods.update({
      where: { id },
      data: {
        images: filteredImages,
      },
    });
  }

  async deletePdfInstructionsById(
    id: string,
    filePath: string,
    lang: Language,
  ): Promise<void> {
    const goods = await this.getOne(id, lang);

    if (goods.instructions) {
      const filteredInstructions = goods.instructions.filter(
        (item) => item.filePath !== filePath,
      );
      this.fileService.deleteFiles([filePath]);

      await this.prisma.goods.update({
        where: { id },
        data: {
          instructions: filteredInstructions,
        },
      });
    }
  }
}
