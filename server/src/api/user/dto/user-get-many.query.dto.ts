import { Role } from '@prisma/client';
import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { BaseQueryGetManyDto } from '../../../common/dto/base-query-get-many.dto';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class UserGetManyQueryDto extends BaseQueryGetManyDto {
  @JoiSchema(Joi.string().email().allow('').empty('').optional())
  email_like?: string;

  @JoiSchema(Joi.string().min(1).max(100).allow('').empty('').optional())
  name_like?: string;

  @JoiSchema(Joi.string().trim().allow('').empty('').optional())
  phone_like?: string;

  @JoiSchema(
    Joi.string()
      .valid(...Object.values(Role))
      .allow('')
      .empty('')
      .optional(),
  )
  role?: Role;

  @JoiSchema(Joi.boolean().optional())
  isBlocked?: boolean;

  @JoiSchema(Joi.date().allow('').empty('').optional())
  createdAt?: Date;

  @JoiSchema(Joi.date().allow('').empty('').optional())
  createdAt_gte?: Date;

  @JoiSchema(Joi.date().allow('').empty('').optional())
  createdAt_lte?: Date;

  @JoiSchema(Joi.date().allow('').empty('').optional())
  updatedAt?: Date;

  @JoiSchema(Joi.date().allow('').empty('').optional())
  updatedAt_gte?: Date;

  @JoiSchema(Joi.date().allow('').empty('').optional())
  updatedAt_lte?: Date;
}
