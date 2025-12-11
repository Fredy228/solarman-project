import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class PortfolioDeleteImageQueryDto {
  @JoiSchema(Joi.string().required())
  image: string;
}
