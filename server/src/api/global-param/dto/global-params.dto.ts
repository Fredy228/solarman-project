import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { globalParamSchema } from 'src/common/validators/global-params/global-param.schema';

JoiSchemaOptions({
  allowUnknown: false,
  convert: true,
});
export class GlobalParamUpdateDto {
  @JoiSchema(globalParamSchema.extract('name').required())
  name: string;

  @JoiSchema(globalParamSchema.extract('value').required())
  value: object;
}
