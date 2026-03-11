import { ProductStatus } from '@prisma/client';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { blogSchema } from 'src/common/validators/blog.schema';
import { BaseQueryGetManyDto } from '../../../common/dto/base-query-get-many.dto';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class BlogGetManyQueryDto extends BaseQueryGetManyDto {
  @JoiSchema(blogSchema.extract('title').allow('').empty('').optional())
  title_like?: string;

  @JoiSchema(blogSchema.extract('status').allow('').empty('').optional())
  status?: ProductStatus;

  @JoiSchema(blogSchema.extract('date').optional())
  createdAt?: Date;

  @JoiSchema(blogSchema.extract('date').optional())
  createdAt_gte?: Date;

  @JoiSchema(blogSchema.extract('date').optional())
  createdAt_lte?: Date;

  @JoiSchema(blogSchema.extract('date').optional())
  updatedAt?: Date;

  @JoiSchema(blogSchema.extract('date').optional())
  updatedAt_gte?: Date;

  @JoiSchema(blogSchema.extract('date').optional())
  updatedAt_lte?: Date;
}
