import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { portfolioSchema } from '../../../common/validators/portfolio.schema';

JoiSchemaOptions({
  allowUnknown: false,
});
export class PortfolioCreateDto {
  @JoiSchema(portfolioSchema.extract('title').required())
  title: string;

  @JoiSchema(portfolioSchema.extract('tag').required())
  tag: string;

  @JoiSchema(portfolioSchema.extract('description').required())
  description: string;

  @JoiSchema(portfolioSchema.extract('date').required())
  date: Date;
}
