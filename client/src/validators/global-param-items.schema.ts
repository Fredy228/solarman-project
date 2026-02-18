import Joi from "joi";
import { EPageType, EStationType } from "../features/global-params";
import type { TranslatorType } from "../i18n/types";
import { ECurrency } from "../shared/types/currency.enum";

export const globalParamContactsSchema = (t: TranslatorType) =>
  Joi.object({
    phone: Joi.string()
      .min(5)
      .max(30)
      .optional()
      .messages({
        "string.min":
          t("phone.name") + t("common.min") + " 5 " + t("common.symbol"),
        "string.max":
          t("phone.name") + t("common.max") + " 30 " + t("common.symbol"),
      }),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .optional()
      .messages({
        "string.email": t("email.base"),
      }),
    address: Joi.object({
      uk: Joi.string()
        .min(1)
        .max(500)
        .optional()
        .messages({
          "string.min":
            t("address.name") + t("common.min") + " 1 " + t("common.symbol"),
          "string.max":
            t("address.name") + t("common.max") + " 500 " + t("common.symbol"),
        }),
      ru: Joi.string()
        .min(1)
        .max(500)
        .optional()
        .messages({
          "string.min":
            t("address.name") + t("common.min") + " 1 " + t("common.symbol"),
          "string.max":
            t("address.name") + t("common.max") + " 500 " + t("common.symbol"),
        }),
    }).optional(),
    link_google_maps: Joi.string()
      .uri()
      .empty("")
      .allow(null)
      .default(null)
      .optional()
      .messages({
        "string.uri": t("link.base"),
      }),
    link_facebook: Joi.string()
      .uri()
      .empty("")
      .allow(null)
      .default(null)
      .optional()
      .messages({
        "string.uri": t("link.base"),
      }),
    link_instagram: Joi.string()
      .uri()
      .empty("")
      .allow(null)
      .default(null)
      .optional()
      .messages({
        "string.uri": t("link.base"),
      }),
    link_telegram: Joi.string()
      .uri()
      .empty("")
      .allow(null)
      .default(null)
      .optional()
      .messages({
        "string.uri": t("link.base"),
      }),
    link_youtube: Joi.string()
      .uri()
      .empty("")
      .allow(null)
      .default(null)
      .optional()
      .messages({
        "string.uri": t("link.base"),
      }),
  });

export const globalParamExchangeRateSchema = () =>
  Joi.object({
    [ECurrency.UAH]: Joi.number().optional(),
    [ECurrency.EUR]: Joi.number().optional(),
  });

const calculatorMinMaxRangeSchema = (t: TranslatorType) =>
  Joi.object({
    min: Joi.number()
      .required()
      .messages({
        "any.required": t("min.name") + t("common.required"),
        "number.base": t("min.base"),
      }),
    max: Joi.number()
      .required()
      .messages({
        "any.required": t("max.name") + t("common.required"),
        "number.base": t("max.base"),
      }),
  });

const calculatorMinMaxRangePowerSchema = (t: TranslatorType) =>
  Joi.object({
    [EStationType.HYBRID]: calculatorMinMaxRangeSchema(t).required(),
    [EStationType.NETWORK]: calculatorMinMaxRangeSchema(t).required(),
  });

export const globalParamCalculatorProfitSchema = (t: TranslatorType) =>
  Joi.object({
    min_max_range_power: Joi.object({
      [EPageType.DEFAULT]: calculatorMinMaxRangePowerSchema(t).required(),
      [EPageType.ENTERPRISE]: calculatorMinMaxRangePowerSchema(t).required(),
      [EPageType.HOME]: calculatorMinMaxRangePowerSchema(t).required(),
      [EPageType.INCOME]: calculatorMinMaxRangePowerSchema(t).required(),
    }).optional(),
    range_power: Joi.object({
      [EStationType.HYBRID]: Joi.array()
        .items(
          Joi.object({
            breakPoint: Joi.number()
              .required()
              .messages({
                "any.required": t("breakPoint.name") + t("common.required"),
                "number.base": t("breakPoint.base"),
              }),
            step: Joi.number()
              .required()
              .messages({
                "any.required": t("step.name") + t("common.required"),
                "number.base": t("step.base"),
              }),
          }),
        )
        .required(),
      [EStationType.NETWORK]: Joi.array()
        .items(
          Joi.object({
            breakPoint: Joi.number()
              .required()
              .messages({
                "any.required": t("breakPoint.name") + t("common.required"),
                "number.base": t("breakPoint.base"),
              }),
            step: Joi.number()
              .required()
              .messages({
                "any.required": t("step.name") + t("common.required"),
                "number.base": t("step.base"),
              }),
          }),
        )
        .required(),
    }).optional(),
    range_rate_per_kwh: Joi.object({
      [EStationType.HYBRID]: Joi.array()
        .items(
          Joi.object({
            breakPoint: Joi.number()
              .required()
              .messages({
                "any.required": t("breakPoint.name") + t("common.required"),
                "number.base": t("breakPoint.base"),
              }),
            rate: Joi.number()
              .required()
              .messages({
                "any.required": t("rate.name") + t("common.required"),
                "number.base": t("rate.base"),
              }),
          }),
        )
        .required(),
      [EStationType.NETWORK]: Joi.array()
        .items(
          Joi.object({
            breakPoint: Joi.number()
              .required()
              .messages({
                "any.required": t("breakPoint.name") + t("common.required"),
                "number.base": t("breakPoint.base"),
              }),
            rate: Joi.number()
              .required()
              .messages({
                "any.required": t("rate.name") + t("common.required"),
                "number.base": t("rate.base"),
              }),
          }),
        )
        .required(),
    }).optional(),
  });
