import { Language, OrderType } from '@prisma/client';
import Joi from 'joi';

export const orderSchema = Joi.object({
  email: Joi.string().email(),
  name: Joi.string().trim().min(1).max(100),
  phone: Joi.string().trim().min(1).max(20),
  notes: Joi.string().trim(),
  lang: Joi.string().valid(Language.UK, Language.RU),
  utmTags: Joi.object({
    utm_source: Joi.string().trim().min(1).max(100).optional(),
    utm_medium: Joi.string().trim().min(1).max(100).optional(),
    utm_campaign: Joi.string().trim().min(1).max(100).optional(),
    utm_term: Joi.string().trim().min(1).max(100).optional(),
    utm_content: Joi.string().trim().min(1).max(100).optional(),
  }),
  pageUrl: Joi.string().uri().trim().min(1).max(500),
  type: Joi.string().valid(...Object.values(OrderType)),
});
