import { ProductStatus } from '@prisma/client';
import Joi from 'joi';

export const portfolioSchema = Joi.object({
  title: Joi.string().trim().min(1).max(250),
  tag: Joi.string().trim().min(1).max(300),
  date: Joi.date(),
  status: Joi.string().valid(...Object.values(ProductStatus)),
  description: Joi.string(),
});
