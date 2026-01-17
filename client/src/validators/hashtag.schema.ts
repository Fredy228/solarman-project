import Joi from "joi";

import { TranslatorType } from "../i18n/types";

export const hashtagchema = (t: TranslatorType) =>
  Joi.object({
    nameUk: Joi.string()
      .trim()
      .min(1)
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

    nameRu: Joi.string()
      .trim()
      .min(1)
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
  });
