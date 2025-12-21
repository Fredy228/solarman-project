import Joi from 'joi';
import { PortfolioType, ProductStatus } from '@prisma/client';

export const portfolioSchema = Joi.object({
  title: Joi.string().trim().min(2).max(250),
  tag: Joi.string().trim().min(5).max(300),
  date: Joi.date(),
  type: Joi.string().valid(...Object.values(PortfolioType)),
  status: Joi.string().valid(...Object.values(ProductStatus)),
  description: Joi.string(),
});
