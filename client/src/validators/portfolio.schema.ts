import Joi from "joi";

import { TranslatorType } from "../i18n/types";

export const portfolioSchema = (t: TranslatorType) =>
  Joi.object({
    cover: Joi.object()
      .instance(File)
      .required()
      .messages({
        "any.required": t("cover.name") + t("common.required"),
        "object.base": t("cover.base"),
      }),

    titleUk: Joi.string()
      .trim()
      .min(2)
      .max(250)
      .required()
      .messages({
        "string.empty": t("title.name") + t("common.required"),
        "any.required": t("title.name") + t("common.required"),
        "string.min":
          t("title.name") + t("common.min") + " 2 " + t("common.symbol"),
        "string.max":
          t("title.name") + t("common.max") + " 250 " + t("common.symbol"),
      }),

    titleRu: Joi.string()
      .trim()
      .min(2)
      .max(250)
      .required()
      .messages({
        "string.empty": t("title.name") + t("common.required"),
        "any.required": t("title.name") + t("common.required"),
        "string.min":
          t("title.name") + t("common.min") + " 2 " + t("common.symbol"),
        "string.max":
          t("title.name") + t("common.max") + " 250 " + t("common.symbol"),
      }),

    tag: Joi.string()
      .trim()
      .min(5)
      .max(300)
      .required()
      .messages({
        "string.empty": t("tag.name") + t("common.required"),
        "any.required": t("tag.name") + t("common.required"),
        "string.min":
          t("tag.name") + t("common.min") + " 2 " + t("common.symbol"),
        "string.max":
          t("tag.name") + t("common.max") + " 300 " + t("common.symbol"),
      }),

    date: Joi.date()
      .required()
      .messages({
        "any.required": t("date.name") + t("common.required"),
        "date.base": t("date.base"),
      }),

    descriptionUk: Joi.array().optional(),

    descriptionRu: Joi.array().optional(),

    images: Joi.array()
      .items(Joi.object().instance(File))
      .max(10)
      .optional()
      .allow(null)
      .messages({
        "array.max": t("images.max") + " 10",
      }),
  });

export const portfolioUpdateSchema = (t: TranslatorType) =>
  portfolioSchema(t).keys({
    cover: Joi.object()
      .instance(File)
      .allow(null)
      .optional()
      .messages({
        "object.base": t("images.base"),
      }),
  });
