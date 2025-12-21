import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { goodsSchema } from '../../../common/validators/goods/goods.schema';
import { GoodsCategory } from '@prisma/client';

JoiSchemaOptions({
  allowUnknown: false,
});
export class GoodsUpdateDto {
  @JoiSchema(goodsSchema.extract('title').optional())
  titleUk?: string;

  @JoiSchema(goodsSchema.extract('title').optional())
  titleRu?: string;

  @JoiSchema(goodsSchema.extract('tag').optional())
  tag?: string;

  @JoiSchema(goodsSchema.extract('country').optional())
  country?: string;

  @JoiSchema(goodsSchema.extract('brand').optional())
  brand?: string;

  @JoiSchema(goodsSchema.extract('description').optional())
  descriptionUk?: string;

  @JoiSchema(goodsSchema.extract('description').optional())
  descriptionRu?: string;

  @JoiSchema(goodsSchema.extract('price').optional())
  price?: number;

  @JoiSchema(goodsSchema.extract('category').optional())
  category?: GoodsCategory;

  @JoiSchema(goodsSchema.extract('specs').optional())
  specs?: Record<string, unknown>;
}
