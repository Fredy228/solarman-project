import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { goodsBrandSchema } from '../../../common/validators/goods-brand.schema';

JoiSchemaOptions({
  allowUnknown: false,
});
export class GoodsBrandUpdateDto {
  @JoiSchema(goodsBrandSchema.extract('name').required())
  name: string;
}
