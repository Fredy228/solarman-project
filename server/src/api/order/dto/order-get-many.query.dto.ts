import { Language, OrderType } from '@prisma/client';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { BaseQueryGetManyDto } from '../../../common/dto/base-query-get-many.dto';
import { goodsSchema } from '../../../common/validators/goods/goods.schema';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class OrderGetManyQueryDto extends BaseQueryGetManyDto {
  @JoiSchema(goodsSchema.extract('email').allow('').empty('').optional())
  email_like?: string;

  @JoiSchema(goodsSchema.extract('name').allow('').empty('').optional())
  name_like?: string;

  @JoiSchema(goodsSchema.extract('name').allow('').empty('').optional())
  phone_like?: string;

  @JoiSchema(goodsSchema.extract('name').allow('').empty('').optional())
  notes_like?: string;

  @JoiSchema(goodsSchema.extract('lang').allow('').empty('').optional())
  lang?: Language;

  @JoiSchema(goodsSchema.extract('type').allow('').empty('').optional())
  type?: OrderType;
}
