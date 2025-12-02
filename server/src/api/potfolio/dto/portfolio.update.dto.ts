import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { portfolioSchema } from '../../../common/validators/portfolio.schema';

JoiSchemaOptions({
  allowUnknown: false,
});
export class PortfolioUpdateDto {
  @JoiSchema(portfolioSchema.extract('title').optional())
  title?: string;

  @JoiSchema(portfolioSchema.extract('tag').optional())
  tag?: string;

  @JoiSchema(portfolioSchema.extract('description').optional())
  description?: string;

  @JoiSchema(portfolioSchema.extract('date').optional())
  date?: Date;
}
