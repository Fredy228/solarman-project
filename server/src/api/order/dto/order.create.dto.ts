import { Language, OrderType } from '@prisma/client';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { type UTMTagsType } from 'src/common/types/utmTags.type';

import { orderSchema } from 'src/common/validators/order.schema';

JoiSchemaOptions({
  allowUnknown: false,
});
export class OrderCreateDto {
  @JoiSchema(orderSchema.extract('email').allow(null).optional())
  email?: string;

  @JoiSchema(orderSchema.extract('name').required())
  name: string;

  @JoiSchema(orderSchema.extract('phone').required())
  phone: string;

  @JoiSchema(orderSchema.extract('notes').allow(null).optional())
  notes?: string;

  @JoiSchema(orderSchema.extract('lang').allow(null).optional())
  lang?: Language;

  @JoiSchema(orderSchema.extract('utmTags').allow(null).optional())
  utmTags?: UTMTagsType;

  @JoiSchema(orderSchema.extract('pageUrl').allow(null).optional())
  pageUrl?: string;

  @JoiSchema(orderSchema.extract('type').allow(null).optional())
  type?: OrderType;
}
