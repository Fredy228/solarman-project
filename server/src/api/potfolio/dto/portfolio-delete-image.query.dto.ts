import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class PortfolioGetManyQueryDto {
  @JoiSchema(Joi.string().required())
  image: string;
}
