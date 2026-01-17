import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { hashtagSchema } from 'src/common/validators/hashtag.schema';

JoiSchemaOptions({
  allowUnknown: false,
});
export class HashtagCreateDto {
  @JoiSchema(hashtagSchema.extract('name').required())
  nameUk: string;

  @JoiSchema(hashtagSchema.extract('name').required())
  nameRu: string;

  @JoiSchema(hashtagSchema.extract('tag').required())
  tag: string;
}
