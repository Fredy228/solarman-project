import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

JoiSchemaOptions({
  allowUnknown: false,
});
export class ForgotPasswordDto {
  @JoiSchema(Joi.string().email().required())
  email: string;
}
