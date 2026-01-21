import Joi from 'joi';

export const hashtagSchema = Joi.object({
  id: Joi.alternatives().try(
    Joi.string().trim().min(1).max(300),
    Joi.array().items(Joi.string().trim().min(1).max(300)),
  ),
  name: Joi.string().trim().min(1).max(250),
  tag: Joi.string().trim().min(1).max(300),
});
