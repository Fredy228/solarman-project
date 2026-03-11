import { ProductStatus } from '@prisma/client';
import Joi from 'joi';

export const blogSchema = Joi.object({
  title: Joi.string().trim().min(1).max(250),
  tag: Joi.string().trim().min(1).max(300),
  status: Joi.string().valid(...Object.values(ProductStatus)),
  description: Joi.string(),
  text: Joi.string(),
  date: Joi.date(),
});
