import Joi from 'joi';

export const globalParamContactsSchema = Joi.object({
  phone: Joi.string().min(5).max(30).optional(),
  email: Joi.string().email().optional(),
  address: Joi.object({
    uk: Joi.string().min(1).max(500).optional(),
    ru: Joi.string().min(1).max(500).optional(),
  }).optional(),
  link_google_maps: Joi.string().uri().allow(null).optional(),
  link_facebook: Joi.string().uri().allow(null).optional(),
  link_instagram: Joi.string().uri().allow(null).optional(),
  link_telegram: Joi.string().uri().allow(null).optional(),
  link_youtube: Joi.string().uri().allow(null).optional(),
});

export const globalParamExchangeRateSchema = Joi.object({
  UAH: Joi.number().optional(),
  EUR: Joi.number().optional(),
});
