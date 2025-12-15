import Joi from 'joi';

export const goodsBrandSchema = Joi.object({
  name: Joi.string().trim().min(1).max(250),
});
