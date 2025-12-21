import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { goodsSchema } from '../../../common/validators/goods/goods.schema';
import { GoodsCategory } from '@prisma/client';

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

  @JoiSchema(goodsSchema.extract('country').optional())
  country?: string;

  @JoiSchema(goodsSchema.extract('brand').optional())
  brand?: string;

  @JoiSchema(goodsSchema.extract('description').required())
  descriptionUk: string;

  @JoiSchema(goodsSchema.extract('description').required())
  descriptionRu: string;

  @JoiSchema(goodsSchema.extract('price').required())
  price: number;

  @JoiSchema(goodsSchema.extract('category').required())
  category: GoodsCategory;

  @JoiSchema(goodsSchema.extract('specs').optional())
  specs?: Record<string, unknown>;
}
