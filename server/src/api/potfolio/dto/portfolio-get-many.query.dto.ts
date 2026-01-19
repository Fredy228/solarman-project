import { ProductStatus } from '@prisma/client';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { BaseQueryGetManyDto } from '../../../common/dto/base-query-get-many.dto';
import { portfolioSchema } from '../../../common/validators/portfolio.schema';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class PortfolioGetManyQueryDto extends BaseQueryGetManyDto {
  @JoiSchema(portfolioSchema.extract('title').allow('').empty('').optional())
  title_like?: string;

  @JoiSchema(portfolioSchema.extract('tag').allow('').empty('').optional())
  hashtag?: string;

  @JoiSchema(portfolioSchema.extract('status').allow('').empty('').optional())
  status?: ProductStatus;

  @JoiSchema(portfolioSchema.extract('date').optional())
  date?: Date;

  @JoiSchema(portfolioSchema.extract('date').optional())
  date_gte?: Date;

  @JoiSchema(portfolioSchema.extract('date').optional())
  date_lte?: Date;
}
