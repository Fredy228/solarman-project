import { HttpStatus, Injectable, PipeTransform } from '@nestjs/common';

import { CustomHttpExceptionUtil } from '../../helpers/custom-http-exection.util';

type TFileImg = {
  [key: string]: Array<Express.Multer.File>;
};

@Injectable()
export class FileValidatorPipe implements PipeTransform {
  constructor(
    private options: {
      [key: string]: {
        maxSize: number;
        nullable: boolean;
        allowType?: string[];
        allowFormat?: string[];
      };
    },
  ) {}

  transform(files: TFileImg) {
    Object.entries(this.options).forEach(([key, value]) => {
      if ((!files[key] || !files[key].length) && value.nullable)
        throw new CustomHttpExceptionUtil(
          HttpStatus.BAD_REQUEST,
          `Ви завантажили не всі файли`,
        );
    });

    Object.entries(files).forEach(([key, value]) => {
      const { allowType, allowFormat, maxSize } = this.options[key];
      for (const file of value) {
        if (allowType && !allowType.includes(file.mimetype.split('/')[0]))
          throw new CustomHttpExceptionUtil(
            HttpStatus.BAD_REQUEST,
            `Ви завантажили не вірний тип файлу`,
          );

        if (allowFormat && !allowFormat.includes(file.mimetype.split('/')[1]))
          throw new CustomHttpExceptionUtil(
            HttpStatus.BAD_REQUEST,
            `Ви завантажили не вірний формат файлу`,
          );

        if (file.size / (1024 * 1024) > maxSize)
          throw new CustomHttpExceptionUtil(
            HttpStatus.BAD_REQUEST,
            `Файл перевищує максимальний розмір ${maxSize} MB`,
          );
      }
    });

    return files;
  }
}
