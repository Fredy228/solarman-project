import { Language, OrderType } from '@prisma/client';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { orderSchema } from 'src/common/validators/order.schema';
import { BaseQueryGetManyDto } from '../../../common/dto/base-query-get-many.dto';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class OrderGetManyQueryDto extends BaseQueryGetManyDto {
  @JoiSchema(orderSchema.extract('email').allow('').empty('').optional())
  email_like?: string;

  @JoiSchema(orderSchema.extract('name').allow('').empty('').optional())
  name_like?: string;

  @JoiSchema(orderSchema.extract('name').allow('').empty('').optional())
  phone_like?: string;

  @JoiSchema(orderSchema.extract('name').allow('').empty('').optional())
  notes_like?: string;

  @JoiSchema(orderSchema.extract('lang').allow('').empty('').optional())
  lang?: Language;

  @JoiSchema(orderSchema.extract('type').allow('').empty('').optional())
  type?: OrderType;

  @JoiSchema(orderSchema.extract('date').allow('').empty('').optional())
  createdAt?: Date;

  @JoiSchema(orderSchema.extract('date').allow('').empty('').optional())
  createdAt_gte?: Date;

  @JoiSchema(orderSchema.extract('date').allow('').empty('').optional())
  createdAt_lte?: Date;

  @JoiSchema(orderSchema.extract('date').allow('').empty('').optional())
  updatedAt?: Date;

  @JoiSchema(orderSchema.extract('date').allow('').empty('').optional())
  updatedAt_gte?: Date;

  @JoiSchema(orderSchema.extract('date').allow('').empty('').optional())
  updatedAt_lte?: Date;
}
