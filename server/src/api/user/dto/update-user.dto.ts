import { Role } from '@prisma/client';
import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

JoiSchemaOptions({
  allowUnknown: false,
});
export class UpdateUserDto {
  @JoiSchema(Joi.string().email().optional())
  email?: string;

  @JoiSchema(Joi.string().min(1).max(100).optional())
  name?: string;

  @JoiSchema(Joi.string().trim().length(12).optional())
  phone?: string;

  @JoiSchema(Joi.boolean().optional())
  isBlocked?: boolean;

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
      .optional(),
  )
  password?: string;

  @JoiSchema(
    Joi.string()
      .valid(...Object.values(Role))
      .optional(),
  )
  role?: Role;
}
