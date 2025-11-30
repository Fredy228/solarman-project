import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class PortfolioGetManyDto {
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
    Joi.string().optional().valid('asc', 'desc').default('DESC').messages({
      'string.base': '_order повинен бути рядком',
      'any.only': '_order повинен бути "ASC" або "DESC"',
    }),
  )
  _order: 'asc' | 'desc';

  @JoiSchema(
    Joi.string().optional().allow('').messages({
      'string.base': 'title_like повинен бути рядком',
    }),
  )
  title_like?: string;

  @JoiSchema(Joi.date().optional())
  date?: Date;

  @JoiSchema(Joi.date().optional())
  date_gte?: Date;

  @JoiSchema(Joi.date().optional())
  date_lte?: Date;
}
