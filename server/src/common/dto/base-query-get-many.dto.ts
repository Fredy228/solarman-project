import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class BaseQueryGetManyDto {
  @JoiSchema(
    Joi.number().optional().default(0).messages({
      'number.base': '_start повинен бути числом',
    }),
  )
  _start: number;

  @JoiSchema(
    Joi.number().optional().default(10).messages({
      'number.base': '_end повинен бути числом',
    }),
  )
  _end: number;

  @JoiSchema(
    Joi.string().optional().default('id').messages({
      'string.base': '_sort повинен бути рядком',
    }),
  )
  _sort: string;

  @JoiSchema(
    Joi.string().optional().valid('asc', 'desc').default('desc').messages({
      'string.base': '_order повинен бути рядком',
      'any.only': '_order повинен бути "asc" або "desc"',
    }),
  )
  _order: 'asc' | 'desc';
}
