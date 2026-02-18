import Joi from "joi";
import { EOrderType } from "../features/order";
import type { TranslatorType } from "../i18n/types";

export const orderSchema = (t: TranslatorType) =>
  Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .trim()
      .allow(null, "")
      .optional()
      .messages({
        "string.email": t("email.base"),
      }),
    name: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .required()
      .messages({
        "string.empty": t("name.name") + t("common.required"),
        "any.required": t("name.name") + t("common.required"),
        "string.min":
          t("name.name") + t("common.min") + " 1 " + t("common.symbol"),
        "string.max":
          t("name.name") + t("common.max") + " 100 " + t("common.symbol"),
      }),
    phone: Joi.string()
      .trim()
      .min(1)
      .max(20)
      .required()
      .messages({
        "string.empty": t("phone.name") + t("common.required"),
        "any.required": t("phone.name") + t("common.required"),
        "string.min":
          t("phone.name") + t("common.min") + " 1 " + t("common.symbol"),
        "string.max":
          t("phone.name") + t("common.max") + " 20 " + t("common.symbol"),
      }),
    notes: Joi.string().trim().allow(null, "").optional(),
    utmTags: Joi.object({
      utm_source: Joi.string().trim().min(1).max(100).optional(),
      utm_medium: Joi.string().trim().min(1).max(100).optional(),
      utm_campaign: Joi.string().trim().min(1).max(100).optional(),
      utm_term: Joi.string().trim().min(1).max(100).optional(),
      utm_content: Joi.string().trim().min(1).max(100).optional(),
    }).optional(),
    pageUrl: Joi.string().trim().min(1).max(500).optional(),
    type: Joi.string()
      .valid(...Object.values(EOrderType))
      .required()
      .messages({
        "any.required": t("type.name") + t("common.required"),
      }),
  });

export const orderConsultationSchema = (t: TranslatorType) =>
  Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .trim()
      .allow(null, "")
      .optional()
      .messages({
        "string.email": t("email.base"),
      }),
    name: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .required()
      .messages({
        "string.empty": t("name.name") + t("common.required"),
        "any.required": t("name.name") + t("common.required"),
        "string.min":
          t("name.name") + t("common.min") + " 1 " + t("common.symbol"),
        "string.max":
          t("name.name") + t("common.max") + " 100 " + t("common.symbol"),
      }),
    phone: Joi.string()
      .trim()
      .min(1)
      .max(20)
      .required()
      .messages({
        "string.empty": t("phone.name") + t("common.required"),
        "any.required": t("phone.name") + t("common.required"),
        "string.min":
          t("phone.name") + t("common.min") + " 1 " + t("common.symbol"),
        "string.max":
          t("phone.name") + t("common.max") + " 20 " + t("common.symbol"),
      }),
  });
