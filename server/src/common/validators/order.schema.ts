import { Language, OrderType } from '@prisma/client';
import Joi from 'joi';

export const orderSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .trim()
    .min(1)
    .allow(null, ''),
  name: Joi.string().trim().min(1).max(100),
  phone: Joi.string().trim().min(1).max(20),
  notes: Joi.string().trim().min(1).max(1000).allow(null, ''),
  utmTags: Joi.object({
    utm_source: Joi.string().trim().min(1).max(100).optional(),
    utm_medium: Joi.string().trim().min(1).max(100).optional(),
    utm_campaign: Joi.string().trim().min(1).max(100).optional(),
    utm_term: Joi.string().trim().min(1).max(100).optional(),
    utm_content: Joi.string().trim().min(1).max(100).optional(),
  }),
  pageUrl: Joi.string().uri().trim().min(1).max(500),
  type: Joi.string().valid(...Object.values(OrderType)),
  lang: Joi.string()
    .valid(...Object.values(Language))
    .allow(null),
  date: Joi.date(),
});
