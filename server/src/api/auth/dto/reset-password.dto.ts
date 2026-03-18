import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

JoiSchemaOptions({
  allowUnknown: false,
});
export class ResetPasswordDto {
  @JoiSchema(Joi.string().email().required())
  email: string;

  @JoiSchema(Joi.string().length(6).required())
  code: string;

  @JoiSchema(
    Joi.string()
      .min(8)
      .max(100)
      .pattern(
        /^[A-Za-z0-9!@#$%^&*()+={}:;"'<>,.?/\\|`~\-_]*$/,
        'valid_characters',
      )
      .pattern(/[A-Z]/, 'uppercase_required')
      .pattern(/[0-9]/, 'number_required')
      .pattern(/[\W_]/, 'special_char_required')
      .required(),
  )
  newPassword: string;
}
