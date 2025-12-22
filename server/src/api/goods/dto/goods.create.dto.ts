import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { BadgeType, ECurrency, GoodsCategory } from '@prisma/client';

import { goodsSchema } from '../../../common/validators/goods/goods.schema';

JoiSchemaOptions({
  allowUnknown: false,
});
export class GoodsCreateDto {
  @JoiSchema(goodsSchema.extract('title').required())
  titleUk: string;

  @JoiSchema(goodsSchema.extract('title').required())
  titleRu: string;

  @JoiSchema(goodsSchema.extract('tag').required())
  tag: string;

  @JoiSchema(goodsSchema.extract('country').allow(null).optional())
  country?: string;

  @JoiSchema(goodsSchema.extract('brand').allow(null).optional())
  brand?: string;

  @JoiSchema(goodsSchema.extract('description').required())
  descriptionUk: string;

  @JoiSchema(goodsSchema.extract('description').required())
  descriptionRu: string;

  @JoiSchema(goodsSchema.extract('price').required())
  price: number;

  @JoiSchema(goodsSchema.extract('category').required())
  category: GoodsCategory;

  @JoiSchema(goodsSchema.extract('specs').allow(null).optional())
  specs?: Record<string, unknown>;

  @JoiSchema(goodsSchema.extract('badge').allow(null).optional())
  badge?: BadgeType;

  @JoiSchema(goodsSchema.extract('discountPrice').allow(null).optional())
  discountPrice?: number;

  @JoiSchema(goodsSchema.extract('currency').required())
  currency: ECurrency;
}
