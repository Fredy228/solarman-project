import { HttpStatus, Injectable, PipeTransform } from '@nestjs/common';

import { CustomHttpExceptionUtil } from '../../helpers/custom-http-exection.util';

type TFileImg = {
  [key: string]: Array<Express.Multer.File>;
};
@Injectable()
export class ImageValidatorPipe implements PipeTransform {
  constructor(
    private options: {
      maxSize: number;
      nullable: boolean;
      allowFormat: string[];
    },
  ) {}

  transform(files: TFileImg) {
    if (!files) {
      if (this.options.nullable) {
        return files;
      } else {
        throw new CustomHttpExceptionUtil(
          HttpStatus.BAD_REQUEST,
          `You have not uploaded any images`,
        );
      }
    }

    for (const key in files) {
      if (Object.prototype.hasOwnProperty.call(files, key)) {
        files[key].forEach((item: Express.Multer.File) => {
          if (item.mimetype.split('/')[0] !== 'image')
            throw new CustomHttpExceptionUtil(
              HttpStatus.BAD_REQUEST,
              `Only images can be uploaded`,
            );

          if (!this.options.allowFormat.includes(item.mimetype.split('/')[1]))
            throw new CustomHttpExceptionUtil(
              HttpStatus.BAD_REQUEST,
              `Invalid image format. Allow format: ${this.options.allowFormat.join(',')}.`,
            );

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
