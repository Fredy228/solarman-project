import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import { join } from 'path';
import sharp, { AvailableFormatInfo, FormatEnum } from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import * as process from 'process';
import {
  ensureDir,
  pathExistsSync,
  removeSync,
  rename,
  writeFile,
} from 'fs-extra';
import { CustomHttpExceptionUtil } from '../../helpers/custom-http-exection.util';
import { unlinkSync } from 'node:fs';

type OptionImageType = {
  width: number;
  height: number;
  fit?: 'inside' | 'outside' | 'cover' | 'contain';
};

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor() {}

  private async generatePathFile({
    file,
    filePath,
    format,
  }: {
    file: Express.Multer.File;
    filePath: string[];
    format?: string;
  }) {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString(
      'utf8',
    );
    const fileName = file.originalname;
    const fileKey = uuidv4();
    const splitFileName = fileName.split('.');
    const extname = splitFileName.pop();

    const fullFolderPath = path.join(process.cwd(), ...filePath);
    await ensureDir(fullFolderPath);

    const fileUniqueName = `${fileKey}-${splitFileName.join('.')}.${format || extname}`;
    const fullFilePath = path.join(fullFolderPath, fileUniqueName);
    const dbFilePath = path.join('api', ...filePath, fileUniqueName);
    return {
      fileName,
      fileKey,
      fullFilePath,
      dbFilePath,
    };
  }

  async saveImage({
    format,
    filePath,
    file,
    option,
  }: {
    file: Express.Multer.File;
    filePath: string[];
    format?: keyof FormatEnum | AvailableFormatInfo;
    option?: OptionImageType;
  }): Promise<string> {
    try {
      const { fullFilePath, dbFilePath } = await this.generatePathFile({
        file,
        filePath,
        format: format as string,
      });

      const sharpAction = sharp(file.buffer);
      if (option) sharpAction.resize(option);
      if (format) sharpAction.toFormat(format);
      await sharpAction.webp({ quality: 85 }).toFile(fullFilePath);

      return dbFilePath;
    } catch (e) {
      this.logger.error(e);
      throw new CustomHttpExceptionUtil(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Помилка збереження файлу зображення.',
      );
    }
  }

  async saveImageMany(
    files: Array<Express.Multer.File>,
    setting: {
      filePath: string[];
      format?: keyof FormatEnum | AvailableFormatInfo;
      option?: OptionImageType;
    },
  ): Promise<Array<string>> {
    return Promise.all(
      files.map((item) => this.saveImage({ ...setting, file: item })),
    );
  }

  async saveFile(
    file: Express.Multer.File,
    ...filePath: string[]
  ): Promise<string | null> {
    try {
      const { fullFilePath, dbFilePath } = await this.generatePathFile({
        file,
        filePath,
      });
      await writeFile(fullFilePath, file.buffer);

      return dbFilePath;
    } catch (e) {
      this.logger.error(e);
      throw new CustomHttpExceptionUtil(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Помилка збереження файлу.',
      );
    }
  }

  async saveFileMany(
    files: Array<Express.Multer.File>,
    ...filePath: string[]
  ): Promise<Array<string | null>> {
    return Promise.all(files.map((item) => this.saveFile(item, ...filePath)));
  }

  deleteFiles(filePaths: string[]): void {
    try {
      filePaths.forEach((filePath: string) => {
        const fullPath = join(process.cwd(), filePath.replace('api/', ''));

        const isExistFile = pathExistsSync(fullPath);
        if (isExistFile) {
          unlinkSync(fullPath);
        }
      });
    } catch (e) {
      this.logger.error(e);
      throw new CustomHttpExceptionUtil(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Помилка видалення файлу.',
      );
    }
  }

  deleteFolder(folderPath: string[]): void {
    try {
      removeSync(join(process.cwd(), ...folderPath));
    } catch (e) {
      this.logger.error(e);
      throw new CustomHttpExceptionUtil(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Помилка видалення папки.',
      );
    }
  }

  async renameFolder(oldPath: string[], newPath: string[]): Promise<void> {
    try {
      const oldFullPath = join(process.cwd(), ...oldPath);
      const newFullPath = join(process.cwd(), ...newPath);

      const isExistFolder = pathExistsSync(oldFullPath);
      if (isExistFolder) {
        await rename(oldFullPath, newFullPath);
      } else {
        throw new CustomHttpExceptionUtil(
          HttpStatus.NOT_FOUND,
          'Папку не знайдено.',
        );
      }
    } catch (e) {
      this.logger.error(e);
      if (e instanceof CustomHttpExceptionUtil) {
        throw e;
      }
      throw new CustomHttpExceptionUtil(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Помилка перейменування папки.',
      );
    }
  }
}
