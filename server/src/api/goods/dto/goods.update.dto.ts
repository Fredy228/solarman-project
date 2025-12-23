import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { BadgeType, ECurrency, GoodsCategory } from '@prisma/client';

import { goodsSchema } from '../../../common/validators/goods/goods.schema';

JoiSchemaOptions({
  allowUnknown: false,
  convert: true,
});
export class GoodsUpdateDto {
  @JoiSchema(goodsSchema.extract('title').optional())
  titleUk?: string;

  @JoiSchema(goodsSchema.extract('title').optional())
  titleRu?: string;

  @JoiSchema(goodsSchema.extract('tag').optional())
  tag?: string;

  @JoiSchema(goodsSchema.extract('country').allow(null).optional())
  country?: string;

  @JoiSchema(goodsSchema.extract('brand').allow(null).optional())
  brand?: string;

  @JoiSchema(goodsSchema.extract('description').optional())
  descriptionUk?: string;

  @JoiSchema(goodsSchema.extract('description').optional())
  descriptionRu?: string;

  @JoiSchema(goodsSchema.extract('price').optional())
  price?: number;

  @JoiSchema(goodsSchema.extract('category').optional())
  category?: GoodsCategory;

  @JoiSchema(goodsSchema.extract('specs').allow(null).optional())
  specs?: Record<string, unknown>;

  @JoiSchema(goodsSchema.extract('badge').allow(null).optional())
  badge?: BadgeType;

  @JoiSchema(goodsSchema.extract('discountPrice').allow(null).optional())
  discountPrice?: number;

  @JoiSchema(goodsSchema.extract('currency').optional())
  currency: ECurrency;
}
