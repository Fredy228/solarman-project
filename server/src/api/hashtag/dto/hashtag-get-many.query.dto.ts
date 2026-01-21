import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { hashtagSchema } from 'src/common/validators/hashtag.schema';
import { BaseQueryGetManyDto } from '../../../common/dto/base-query-get-many.dto';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class HashtagGetManyQueryDto extends BaseQueryGetManyDto {
  @JoiSchema(hashtagSchema.extract('name').optional().allow(''))
  name_like?: string;

  @JoiSchema(hashtagSchema.extract('id').optional().allow('').empty(''))
  id?: string | string[];
}
