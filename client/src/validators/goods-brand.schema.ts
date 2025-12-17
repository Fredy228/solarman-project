import Joi from "joi";

import { TranslatorType } from "../i18n/types";

export const goodsBrandSchema = (t: TranslatorType) =>
  Joi.object({
    name: Joi.string()
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
  });
