import Joi from "joi";
import { EOrderType } from "../features/order";
import type { TranslatorType } from "../i18n/types";

export const orderSchema = (t: TranslatorType) =>
  Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .trim()
      .allow(null, "")
      .optional(),
    name: Joi.string().trim().min(1).max(100).required(),
    phone: Joi.string().trim().min(1).max(20).required(),
    notes: Joi.string().trim().allow(null, "").optional(),
    utmTags: Joi.object({
      utm_source: Joi.string().trim().min(1).max(100).optional(),
      utm_medium: Joi.string().trim().min(1).max(100).optional(),
      utm_campaign: Joi.string().trim().min(1).max(100).optional(),
      utm_term: Joi.string().trim().min(1).max(100).optional(),
      utm_content: Joi.string().trim().min(1).max(100).optional(),
    }).optional(),
    pageUrl: Joi.string().uri().trim().min(1).max(500).optional(),
    type: Joi.string()
      .valid(...Object.values(EOrderType))
      .required(),
  });
