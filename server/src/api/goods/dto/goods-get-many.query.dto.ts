import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { BaseQueryGetManyDto } from '../../../common/dto/base-query-get-many.dto';
import { goodsSchema } from '../../../common/validators/goods/goods.schema';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class GoodsGetManyQueryDto extends BaseQueryGetManyDto {
  @JoiSchema(goodsSchema.extract('title').optional().allow(''))
  title_like?: string;

  @JoiSchema(goodsSchema.extract('tag').optional().allow(''))
  tag_like?: string;
}
