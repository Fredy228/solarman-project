import Joi from 'joi';

export const portfolioSchema = Joi.object({
  title: Joi.string().trim().min(2).max(250),

  tag: Joi.string().trim().min(5).max(300),

  date: Joi.date(),

  description: Joi.string(),
});
