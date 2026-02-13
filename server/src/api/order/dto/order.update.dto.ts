import { Language, OrderType } from '@prisma/client';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { type UTMTagsType } from 'src/common/types/utmTags.type';

import { orderSchema } from 'src/common/validators/order.schema';

JoiSchemaOptions({
  allowUnknown: false,
});
export class OrderUpdateDto {
  @JoiSchema(orderSchema.extract('email').allow(null).optional())
  email?: string;

  @JoiSchema(orderSchema.extract('name').optional())
  name?: string;

  @JoiSchema(orderSchema.extract('phone').optional())
  phone?: string;

  @JoiSchema(orderSchema.extract('notes').allow(null).optional())
  notes?: string;

  @JoiSchema(orderSchema.extract('lang').allow(null).optional())
  lang?: Language;

  @JoiSchema(orderSchema.extract('utmTags').allow(null).optional())
  utmTags?: UTMTagsType;

  @JoiSchema(orderSchema.extract('type').allow(null).optional())
  type?: OrderType;
}
