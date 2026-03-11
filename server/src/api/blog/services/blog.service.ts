import { HttpStatus, Injectable } from '@nestjs/common';
import { Blog, Prisma } from '@prisma/client';
import { ObjectId } from 'bson';

import { Block } from '@blocknote/core';
import { BlogErrorMessage } from 'src/common/messages/error/blog.message';
import { extractImageUrls } from 'src/helpers/extract-image-urls.util';
import { replaceImageUrls } from 'src/helpers/replace-image-urls.util';
import { Language } from '../../../common/enums/language.enum';
import { CustomHttpExceptionUtil } from '../../../helpers/custom-http-exection.util';
import { prepareLocalizedUpdate } from '../../../helpers/prisma/prepare-localized-update';
import { FileService } from '../../../libs/file/file.service';
import { PrismaService } from '../../../libs/prisma/prisma.service';
import { BlogCreateDto } from '../dto/blog.create.dto';
import { BlogUpdateDto } from '../dto/blog.update.dto';

@Injectable()
export class BlogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async create(
    body: BlogCreateDto,
    files: {
      cover: Array<Express.Multer.File>;
    },
    lang: Language,
  ): Promise<Blog> {
    const existBlog = await this.prisma.blog.findUnique({
      where: {
        tag: body.tag,
      },
      select: {
        id: true,
      },
    });
    if (existBlog)
      throw new CustomHttpExceptionUtil(
        HttpStatus.BAD_REQUEST,
        BlogErrorMessage[lang].ALREADY_EXIST,
      );

    const newId = new ObjectId().toString();

    const {
      titleUk,
      titleRu,
      descriptionRu,
      descriptionUk,
      tag,
      textUk,
      textRu,
    } = body;

    const textUkParsed = JSON.parse(textUk) as Block[];
    const textRuParsed = JSON.parse(textRu) as Block[];

    const textImageUrls: string[] = [
      ...new Set([
        ...extractImageUrls(textUkParsed),
        ...extractImageUrls(textRuParsed),
      ]),
    ];

    const urlReplaceMap: Record<string, string> = {};
    await Promise.all(
      textImageUrls.map(async (url) => {
        if (!url) return;
        const newUrl = await this.fileService.moveFile(url, [
          'static',
          'blog',
          newId,
        ]);
        if (!newUrl) return;
        urlReplaceMap[url] = newUrl;
      }),
    );

    const textUkUpdated = replaceImageUrls(textUkParsed, urlReplaceMap);
    const textRuUpdated = replaceImageUrls(textRuParsed, urlReplaceMap);

    const coverPath = await this.fileService.saveImage({
      file: files.cover[0],
      filePath: ['static', 'blog', newId],
      format: 'webp',
    });

    return this.prisma.blog.create({
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
        text: {
          uk: JSON.stringify(textUkUpdated),
          ru: JSON.stringify(textRuUpdated),
        },
        cover: coverPath,
      },
    });
  }

  async getOne(id: string, lang: Language): Promise<Blog> {
    const blog = await this.prisma.blog.findUnique({
      where: {
        id,
      },
    });

    if (!blog)
      throw new CustomHttpExceptionUtil(
        HttpStatus.NOT_FOUND,
        BlogErrorMessage[lang].NOT_FOUND,
      );

    return blog;
  }

  async update(
    id: string,
    body: BlogUpdateDto,
    files: {
      cover?: Array<Express.Multer.File>;
    },
    lang: Language,
  ) {
    const blog = await this.getOne(id, lang);
    const { textUk, textRu } = body;

    const updatedBody: Prisma.BlogUpdateInput = {
      tag: body?.tag,
      title: prepareLocalizedUpdate(body?.titleUk, body?.titleRu),
      description: prepareLocalizedUpdate(
        body?.descriptionUk,
        body?.descriptionRu,
      ),
      text: prepareLocalizedUpdate(body?.textUk, body?.textRu),
      status: body?.status,
    };

    if (files?.cover && files.cover[0]) {
      updatedBody['cover'] = await this.fileService.saveImage({
        file: files.cover[0],
        filePath: ['static', 'blog', blog.id],
        format: 'webp',
      });

      this.fileService.deleteFiles([blog.cover]);
    }

    if (textUk || textRu) {
      const textUkParsed = textUk ? (JSON.parse(textUk) as Block[]) : null;
      const textRuParsed = textRu ? (JSON.parse(textRu) as Block[]) : null;

      const textImageUrlsCurrent: string[] = [
        ...new Set([
          ...extractImageUrls(JSON.parse(blog.text.uk) as Block[]),
          ...extractImageUrls(JSON.parse(blog.text.ru) as Block[]),
        ]),
      ];
      const textImageUrlsNew: string[] = [
        ...new Set([
          ...(textUkParsed ? extractImageUrls(textUkParsed) : []),
          ...(textRuParsed ? extractImageUrls(textRuParsed) : []),
        ]),
      ];

      const addedImages = textImageUrlsNew.filter(
        (url) => !textImageUrlsCurrent.includes(url),
      );
      const removedImages = textImageUrlsCurrent.filter(
        (url) => !textImageUrlsNew.includes(url),
      );

      const urlReplaceMap: Record<string, string> = {};
      await Promise.all(
        addedImages.map(async (url) => {
          if (!url) return;
          const newUrl = await this.fileService.moveFile(url, [
            'static',
            'blog',
            blog.id,
          ]);
          if (!newUrl) return;
          urlReplaceMap[url] = newUrl;
        }),
      );
      this.fileService.deleteFiles(removedImages);

      let textUkUpdated: undefined | Block[] = undefined;
      let textRuUpdated: undefined | Block[] = undefined;
      if (textUk && textUkParsed)
        textUkUpdated = replaceImageUrls(textUkParsed, urlReplaceMap);
      if (textRu && textRuParsed)
        textRuUpdated = replaceImageUrls(textRuParsed, urlReplaceMap);
      updatedBody.text = prepareLocalizedUpdate(
        JSON.stringify(textUkUpdated),
        JSON.stringify(textRuUpdated),
      );
    }

    return this.prisma.blog.update({
      where: {
        id,
      },
      data: updatedBody,
    });
  }

  async deleteById(id: string, lang: Language): Promise<void> {
    const blog = await this.getOne(id, lang);

    this.fileService.deleteFolder(['static', 'blog', blog.id]);
    await this.prisma.blog.delete({ where: { id } });
  }
}
