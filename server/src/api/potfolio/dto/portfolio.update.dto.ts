import { ProductStatus } from '@prisma/client';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { portfolioSchema } from '../../../common/validators/portfolio.schema';

JoiSchemaOptions({
  allowUnknown: false,
});
export class PortfolioUpdateDto {
  @JoiSchema(portfolioSchema.extract('title').optional())
  titleUk?: string;

  @JoiSchema(portfolioSchema.extract('title').optional())
  titleRu?: string;

  @JoiSchema(portfolioSchema.extract('tag').optional())
  tag?: string;

  @JoiSchema(portfolioSchema.extract('description').optional())
  descriptionUk?: string;

  @JoiSchema(portfolioSchema.extract('description').optional())
  descriptionRu?: string;

  @JoiSchema(portfolioSchema.extract('date').optional())
  date?: Date;

  @JoiSchema(portfolioSchema.extract('status').optional())
  status?: ProductStatus;
}
