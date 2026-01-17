import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { hashtagSchema } from 'src/common/validators/hashtag.schema';

JoiSchemaOptions({
  allowUnknown: false,
});
export class HashtagUpdateDto {
  @JoiSchema(hashtagSchema.extract('name').optional())
  nameUk: string;

  @JoiSchema(hashtagSchema.extract('name').optional())
  nameRu: string;

  @JoiSchema(hashtagSchema.extract('tag').optional())
  tag: string;
}
