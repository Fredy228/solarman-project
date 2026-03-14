import Joi from "joi";

import { TranslatorType } from "../i18n/types";

export const blogSchema = (t: TranslatorType) =>
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
          t("tag.name") + t("common.min") + " 5 " + t("common.symbol"),
        "string.max":
          t("tag.name") + t("common.max") + " 300 " + t("common.symbol"),
      }),

    descriptionUk: Joi.string()
      .trim()
      .min(2)
      .max(1500)
      .required()
      .messages({
        "string.empty": t("description.name") + t("common.required"),
        "any.required": t("description.name") + t("common.required"),
        "string.min":
          t("description.name") + t("common.min") + " 2 " + t("common.symbol"),
        "string.max":
          t("description.name") +
          t("common.max") +
          " 1500 " +
          t("common.symbol"),
      }),

    descriptionRu: Joi.string()
      .trim()
      .min(2)
      .max(1500)
      .required()
      .messages({
        "string.empty": t("description.name") + t("common.required"),
        "any.required": t("description.name") + t("common.required"),
        "string.min":
          t("description.name") + t("common.min") + " 2 " + t("common.symbol"),
        "string.max":
          t("description.name") +
          t("common.max") +
          " 1500 " +
          t("common.symbol"),
      }),

    textUk: Joi.array()
      .items(Joi.object().unknown(true))
      .min(1)
      .required()
      .messages({
        "array.base": t("text.base"),
        "array.min": t("text.min"),
      }),

    textRu: Joi.array()
      .items(Joi.object().unknown(true))
      .min(1)
      .required()
      .messages({
        "array.base": t("text.base"),
        "array.min": t("text.min"),
      }),
  });

export const blogUpdateSchema = (t: TranslatorType) =>
  blogSchema(t).keys({
    cover: Joi.object()
      .instance(File)
      .allow(null)
      .optional()
      .messages({
        "object.base": t("images.base"),
      }),
  });
