import { ProductStatus } from '@prisma/client';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { blogSchema } from 'src/common/validators/blog.schema';

JoiSchemaOptions({
  allowUnknown: false,
});
export class BlogUpdateDto {
  @JoiSchema(blogSchema.extract('title').optional())
  titleUk?: string;

  @JoiSchema(blogSchema.extract('title').optional())
  titleRu?: string;

  @JoiSchema(blogSchema.extract('tag').optional())
  tag?: string;

  @JoiSchema(blogSchema.extract('description').optional())
  descriptionUk?: string;

  @JoiSchema(blogSchema.extract('description').optional())
  descriptionRu?: string;

  @JoiSchema(blogSchema.extract('text').optional())
  textUk?: string;

  @JoiSchema(blogSchema.extract('text').optional())
  textRu?: string;

  @JoiSchema(blogSchema.extract('status').optional())
  status?: ProductStatus;
}
