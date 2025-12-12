import { HttpStatus, Injectable } from '@nestjs/common';
import { Portfolio, Prisma } from '@prisma/client';
import { ObjectId } from 'bson';

import { PortfolioCreateDto } from '../dto/portfolio.create.dto';
import { PrismaService } from '../../../libs/prisma/prisma.service';
import { CustomHttpExceptionUtil } from '../../../helpers/custom-http-exection.util';
import { FileService } from '../../../libs/file/file.service';
import { PortfolioUpdateDto } from '../dto/portfolio.update.dto';
import { PortfolioErrorMessage } from '../../../common/messages/error/portfolio.message';
import { Language } from '../../../common/enums/language.enum';
import { prepareLocalizedUpdate } from '../../../helpers/prisma/prepare-localized-update';

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

    const { titleUk, titleRu, descriptionRu, descriptionUk, tag, date } = body;

    const newId = new ObjectId().toString();

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
          uk: descriptionUk,
          ru: descriptionRu,
        },
        date,
        cover: coverPath,
        images: imagesPath,
      },
    });
  }

  async getOne(id: string, lang: Language): Promise<Portfolio> {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: {
        id,
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

    const updatedBody: Prisma.PortfolioUpdateInput = {
      tag: body?.tag,
      title: prepareLocalizedUpdate(body?.titleUk, body?.titleRu),
      description: prepareLocalizedUpdate(
        body?.descriptionUk,
        body?.descriptionRu,
      ),
      date: body?.date,
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
