import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { PortfolioType } from '@prisma/client';

import { portfolioSchema } from '../../../common/validators/portfolio.schema';

JoiSchemaOptions({
  allowUnknown: false,
});
export class PortfolioCreateDto {
  @JoiSchema(portfolioSchema.extract('title').required())
  titleUk: string;

  @JoiSchema(portfolioSchema.extract('title').required())
  titleRu: string;

  @JoiSchema(portfolioSchema.extract('tag').required())
  tag: string;

  @JoiSchema(portfolioSchema.extract('description').required())
  descriptionUk: string;

  @JoiSchema(portfolioSchema.extract('description').required())
  descriptionRu: string;

  @JoiSchema(portfolioSchema.extract('date').required())
  date: Date;

  @JoiSchema(portfolioSchema.extract('type').required())
  type: PortfolioType;
}
