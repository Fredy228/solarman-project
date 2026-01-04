import { BadgeType, GoodsCategory, ProductStatus } from '@prisma/client';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { BaseQueryGetManyDto } from '../../../common/dto/base-query-get-many.dto';
import { goodsSchema } from '../../../common/validators/goods/goods.schema';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class GoodsGetManyQueryDto extends BaseQueryGetManyDto {
  @JoiSchema(goodsSchema.extract('title').allow('').empty('').optional())
  title_like?: string;

  @JoiSchema(goodsSchema.extract('price').allow('').empty('').optional())
  price_gte?: number;

  @JoiSchema(goodsSchema.extract('price').allow('').empty('').optional())
  price_lte?: number;

  @JoiSchema(
    goodsSchema.extract('discountPrice').allow('').empty('').optional(),
  )
  discountPrice_gte?: number;

  @JoiSchema(
    goodsSchema.extract('discountPrice').allow('').empty('').optional(),
  )
  discountPrice_lte?: number;

  @JoiSchema(goodsSchema.extract('status').allow('').empty('').optional())
  status?: ProductStatus;

  @JoiSchema(goodsSchema.extract('badge').allow('').empty('').optional())
  badge?: BadgeType;

  @JoiSchema(goodsSchema.extract('category').allow('').empty('').optional())
  category?: GoodsCategory;
}
