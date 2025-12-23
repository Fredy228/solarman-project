import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class PortfolioDeleteImageDto {
  @JoiSchema(Joi.string().required())
  path: string;
}
