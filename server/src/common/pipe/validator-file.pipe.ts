import { HttpStatus, Injectable, PipeTransform } from '@nestjs/common';

import { CustomHttpExceptionUtil } from '../../helpers/custom-http-exection.util';

type TFileImg = {
  [key: string]: Array<Express.Multer.File>;
};
@Injectable()
export class FileValidatorPipe implements PipeTransform {
  constructor(private options: { maxSize: number; nullable: boolean }) {}

  transform(files: TFileImg) {
    if (!files) {
      if (this.options.nullable) {
        return files;
      } else {
        throw new CustomHttpExceptionUtil(
          HttpStatus.BAD_REQUEST,
          `You have not uploaded any files`,
        );
      }
    }

    for (const key in files) {
      if (Object.prototype.hasOwnProperty.call(files, key)) {
        files[key].forEach((item: Express.Multer.File) => {
          if (item.size / (1024 * 1024) > this.options.maxSize)
            throw new CustomHttpExceptionUtil(
              HttpStatus.BAD_REQUEST,
              `The file is too large. Maximum size ${this.options.maxSize} MB`,
            );
        });
      }
    }

    return files;
  }
}
