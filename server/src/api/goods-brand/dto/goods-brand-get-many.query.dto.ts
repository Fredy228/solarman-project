import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { BaseQueryGetManyDto } from '../../../common/dto/base-query-get-many.dto';
import { goodsBrandSchema } from '../../../common/validators/goods-brand.schema';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class GoodsBrandGetManyQueryDto extends BaseQueryGetManyDto {
  @JoiSchema(goodsBrandSchema.extract('name').optional().allow(''))
  name_like?: string;
}
