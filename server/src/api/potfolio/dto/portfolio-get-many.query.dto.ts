import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';

import { BaseQueryGetManyDto } from '../../../common/dto/base-query-get-many.dto';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class PortfolioGetManyQueryDto extends BaseQueryGetManyDto {
  @JoiSchema(Joi.string().optional().allow(''))
  title_like?: string;

  @JoiSchema(Joi.date().optional())
  date?: Date;

  @JoiSchema(Joi.date().optional())
  date_gte?: Date;

  @JoiSchema(Joi.date().optional())
  date_lte?: Date;
}
