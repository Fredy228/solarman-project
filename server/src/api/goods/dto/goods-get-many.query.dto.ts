import { BadgeType, GoodsCategory, ProductStatus } from '@prisma/client';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { BaseQueryGetManyDto } from '../../../common/dto/base-query-get-many.dto';
import { EMaterialType } from '../../../common/enums/goods/spec-material.enum';
import {
  EBatterySpecType,
  EFastenerSpecType,
  EInvertorSpecType,
  EPanelSpecType,
} from '../../../common/enums/goods/spec-type.emum';
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

  @JoiSchema(
    Joi.array()
      .items(
        Joi.string().valid(
          ...new Set([
            ...Object.values(EPanelSpecType),
            ...Object.values(EInvertorSpecType),
            ...Object.values(EBatterySpecType),
            ...Object.values(EFastenerSpecType),
          ]),
        ),
      )
      .single()
      .optional(),
  )
  type?: string | string[];

  @JoiSchema(Joi.array().items(Joi.number()).single().optional())
  power?: number | number[];

  @JoiSchema(Joi.array().items(Joi.number().valid(1, 3)).single().optional())
  phase?: number | number[];

  @JoiSchema(Joi.array().items(Joi.number()).single().optional())
  capacity?: number | number[];

  @JoiSchema(Joi.array().items(Joi.number()).single().optional())
  voltage?: number | number[];

  @JoiSchema(
    Joi.array()
      .items(Joi.string().valid(...Object.values(EMaterialType)))
      .single()
      .optional(),
  )
  material?: string | string[];

  @JoiSchema(
    Joi.array().items(goodsSchema.extract('country')).single().optional(),
  )
  country?: string | string[];

  @JoiSchema(
    Joi.array().items(Joi.string().hex().length(24)).single().optional(),
  )
  brand?: string | string[];
}
