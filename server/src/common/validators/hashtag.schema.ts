import Joi from 'joi';

export const hashtagSchema = Joi.object({
  name: Joi.string().trim().min(1).max(250),
  tag: Joi.string().trim().min(1).max(300),
});
