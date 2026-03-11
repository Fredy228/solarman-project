import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { blogSchema } from 'src/common/validators/blog.schema';

JoiSchemaOptions({
  allowUnknown: false,
});
export class BlogCreateDto {
  @JoiSchema(blogSchema.extract('title').required())
  titleUk: string;

  @JoiSchema(blogSchema.extract('title').required())
  titleRu: string;

  @JoiSchema(blogSchema.extract('tag').required())
  tag: string;

  @JoiSchema(blogSchema.extract('description').required())
  descriptionUk: string;

  @JoiSchema(blogSchema.extract('description').required())
  descriptionRu: string;

  @JoiSchema(blogSchema.extract('text').required())
  textUk: string;

  @JoiSchema(blogSchema.extract('text').required())
  textRu: string;
}
