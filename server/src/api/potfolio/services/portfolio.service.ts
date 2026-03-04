import { HttpStatus, Injectable } from '@nestjs/common';
import { Portfolio, Prisma } from '@prisma/client';
import { ObjectId } from 'bson';

import { Block } from '@blocknote/core';
import { extractImageUrls } from 'src/helpers/extract-image-urls.util';
import { replaceImageUrls } from 'src/helpers/replace-image-urls.util';
import { Language } from '../../../common/enums/language.enum';
import { PortfolioErrorMessage } from '../../../common/messages/error/portfolio.message';
import { CustomHttpExceptionUtil } from '../../../helpers/custom-http-exection.util';
import { prepareLocalizedUpdate } from '../../../helpers/prisma/prepare-localized-update';
import { FileService } from '../../../libs/file/file.service';
import { PrismaService } from '../../../libs/prisma/prisma.service';
import { PortfolioCreateDto } from '../dto/portfolio.create.dto';
import { PortfolioUpdateDto } from '../dto/portfolio.update.dto';

@Injectable()
export class PortfolioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async create(
    body: PortfolioCreateDto,
    files: {
      cover: Array<Express.Multer.File>;
      images?: Array<Express.Multer.File>;
    },
  ) {
    const existPortfolio = await this.prisma.portfolio.findUnique({
      where: {
        tag: body.tag,
      },
      select: {
        id: true,
      },
    });
    if (existPortfolio)
      throw new CustomHttpExceptionUtil(
        HttpStatus.BAD_REQUEST,
        `Портфоліо з тегом ${body.tag} вже існує`,
      );

    const newId = new ObjectId().toString();

    const {
      titleUk,
      titleRu,
      descriptionRu,
      descriptionUk,
      tag,
      date,
      hashtags,
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
          'portfolio',
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
      file: files.cover[0],
      filePath: ['static', 'portfolio', newId],
      format: 'webp',
    });

    const imagesPath = await this.fileService.saveImageMany(
      files?.images || [],
      {
        filePath: ['static', 'portfolio', newId],
        format: 'webp',
      },
    );

    return this.prisma.portfolio.create({
      data: {
        id: newId,
        tag,
        title: {
          uk: titleUk,
          ru: titleRu,
        },
        description: {
          uk: JSON.stringify(descriptionUkUpdated),
          ru: JSON.stringify(descriptionRuUpdated),
        },
        date,
        cover: coverPath,
        images: imagesPath,
        hashtags: {
          connect: hashtags.map((id) => ({ id })),
        },
      },
    });
  }

  async getOne(id: string, lang: Language): Promise<Portfolio> {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: {
        id,
      },
      include: {
        hashtags: true,
      },
    });

    if (!portfolio)
      throw new CustomHttpExceptionUtil(
        HttpStatus.NOT_FOUND,
        PortfolioErrorMessage[lang].NOT_FOUND,
      );

    return portfolio;
  }

  async update(
    id: string,
    body: PortfolioUpdateDto,
    files: {
      cover?: Array<Express.Multer.File>;
      images?: Array<Express.Multer.File>;
    },
    lang: Language,
  ) {
    const portfolio = await this.getOne(id, lang);
    const { descriptionUk, descriptionRu } = body;

    const updatedBody: Prisma.PortfolioUpdateInput = {
      tag: body?.tag,
      title: prepareLocalizedUpdate(body?.titleUk, body?.titleRu),
      description: prepareLocalizedUpdate(
        body?.descriptionUk,
        body?.descriptionRu,
      ),
      date: body?.date,
      status: body?.status,
    };

    if (body.hashtags)
      updatedBody.hashtags = {
        connect: body.hashtags
          .filter((id) => !portfolio.hashtagIds.includes(id))
          .map((id) => ({ id })),
        disconnect: portfolio.hashtagIds
          .filter((id) => !body.hashtags.includes(id))
          .map((id) => ({ id })),
      };

    if (files?.cover && files.cover[0]) {
      updatedBody['cover'] = await this.fileService.saveImage({
        file: files.cover[0],
        filePath: ['static', 'portfolio', portfolio.id],
        format: 'webp',
      });

      this.fileService.deleteFiles([portfolio.cover]);
    }

    if (files?.images && files.images.length) {
      const imagesPath = await this.fileService.saveImageMany(
        files.images || [],
        {
          filePath: ['static', 'portfolio', portfolio.id],
          format: 'webp',
        },
      );
      updatedBody['images'] = portfolio.images.concat(imagesPath);
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
          ...extractImageUrls(JSON.parse(portfolio.description.uk) as Block[]),
          ...extractImageUrls(JSON.parse(portfolio.description.ru) as Block[]),
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
            'portfolio',
            portfolio.id,
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

    return this.prisma.portfolio.update({
      where: {
        id,
      },
      data: updatedBody,
    });
  }

  async deleteById(id: string, lang: Language): Promise<void> {
    const portfolio = await this.getOne(id, lang);

    this.fileService.deleteFolder(['static', 'portfolio', portfolio.id]);
    await this.prisma.portfolio.delete({ where: { id } });
  }

  async deleteImageById(
    id: string,
    image: string,
    lang: Language,
  ): Promise<void> {
    const portfolio = await this.getOne(id, lang);

    const images = portfolio.images.filter((item) => item !== image);
    this.fileService.deleteFiles([image]);

    await this.prisma.portfolio.update({
      where: { id },
      data: {
        images,
      },
    });
  }
}
