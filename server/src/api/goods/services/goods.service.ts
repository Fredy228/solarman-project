import { HttpStatus, Injectable } from '@nestjs/common';
import { ObjectId } from 'bson';
import { Prisma } from '@prisma/client';

import { FileService } from '../../../libs/file/file.service';
import { PrismaService } from '../../../libs/prisma/prisma.service';
import { GoodsCreateDto } from '../dto/goods.create.dto';
import { CustomHttpExceptionUtil } from '../../../helpers/custom-http-exection.util';
import { Language } from '../../../common/enums/language.enum';
import { GoodsErrorMessage } from '../../../common/messages/error/goods.message';
// import { extractImageUrls } from 'src/helpers/extractImageUrls.util';

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
    // const descriptionImageUrls: string[] = [
    //   ...new Set([
    //     ...extractImageUrls(JSON.parse(descriptionUk)),
    //     ...extractImageUrls(JSON.parse(descriptionRu)),
    //   ]),
    // ];

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
        ru: descriptionRu,
        uk: descriptionUk,
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
}
