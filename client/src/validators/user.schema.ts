import Joi from "joi";

import { EUserRole } from "../features/user/types/user-role";
import type { TranslatorType } from "../i18n/types";

export const userSchema = (t: TranslatorType) =>
  Joi.object({
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
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .trim()
      .required()
      .messages({
        "string.empty": t("email.name") + t("common.required"),
        "any.required": t("email.name") + t("common.required"),
        "string.email": t("email.base"),
      }),
    phone: Joi.string()
      .trim()
      .allow(null, "")
      .optional()
      .messages({
        "string.min":
          t("phone.name") + t("common.min") + " 1 " + t("common.symbol"),
        "string.max":
          t("phone.name") + t("common.max") + " 20 " + t("common.symbol"),
      }),
    password: Joi.string()
      .min(8)
      .max(100)
      .pattern(/[A-Z]/)
      .pattern(/[0-9]/)
      .pattern(/[\W_]/)
      .required()
      .messages({
        "string.empty": t("password.name") + t("common.required"),
        "any.required": t("password.name") + t("common.required"),
        "string.min":
          t("password.name") + t("common.min") + " 8 " + t("common.symbol"),
        "string.max":
          t("password.name") + t("common.max") + " 100 " + t("common.symbol"),
        "string.pattern.base": t("password.base"),
      }),
    role: Joi.string()
      .valid(...Object.values(EUserRole))
      .required()
      .messages({
        "string.empty": t("role.name") + t("common.required"),
        "any.required": t("role.name") + t("common.required"),
        "any.only": t("role.name") + t("common.valid"),
      }),
    isBlocked: Joi.boolean().optional().default(false),
  });

export const userEditSchema = (t: TranslatorType) =>
  Joi.object({
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
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .trim()
      .required()
      .messages({
        "string.empty": t("email.name") + t("common.required"),
        "any.required": t("email.name") + t("common.required"),
        "string.email": t("email.base"),
      }),
    phone: Joi.string()
      .trim()
      .allow(null, "")
      .optional()
      .messages({
        "string.min":
          t("phone.name") + t("common.min") + " 1 " + t("common.symbol"),
        "string.max":
          t("phone.name") + t("common.max") + " 20 " + t("common.symbol"),
      }),
    password: Joi.string()
      .min(8)
      .max(100)
      .pattern(/[A-Z]/)
      .pattern(/[0-9]/)
      .pattern(/[\W_]/)
      .allow(null, "")
      .optional()
      .messages({
        "string.min":
          t("password.name") + t("common.min") + " 8 " + t("common.symbol"),
        "string.max":
          t("password.name") + t("common.max") + " 100 " + t("common.symbol"),
        "string.pattern.base": t("password.base"),
      }),
    role: Joi.string()
      .valid(...Object.values(EUserRole))
      .required()
      .messages({
        "string.empty": t("role.name") + t("common.required"),
        "any.required": t("role.name") + t("common.required"),
        "any.only": t("role.name") + t("common.valid"),
      }),
    isBlocked: Joi.boolean().optional().default(false),
  });
