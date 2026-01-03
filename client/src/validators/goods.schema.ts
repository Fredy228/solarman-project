import Joi from "joi";

import { EBadgeType, EGoodsCategory } from "../features/goods";
import { TranslatorType } from "../i18n/types";
import { joiJsonCheck } from "../libs/joi-json-check";
import { ECurrency } from "../shared/types/currency.enum";
import {
  batterySpecSchema,
  chargeStationSpecSchema,
  fastenerSpecSchema,
  invertorSpecSchema,
  panelSpecSchema,
  readyMadeSolutionSpecSchema,
} from "./goods-specs.schema";

const spy = (value: any, helpers: any) => {
  console.log("👀 Joi видит:", value, "| Тип:", typeof value);
  return value; // Обязательно возвращаем значение, чтобы валидация шла дальше
};

export const goodsSchema = (t: TranslatorType) =>
  Joi.object({
    cover: Joi.object()
      .instance(File)
      .required()
      .messages({
        "any.required": t("cover.name") + t("common.required"),
        "object.base": t("cover.base"),
      }),
    images: Joi.array()
      .items(Joi.object().instance(File))
      .max(10)
      .optional()
      .allow(null)
      .messages({
        "array.max": t("images.max") + " 10",
      }),
    instructions: Joi.array()
      .items(Joi.object().instance(File))
      .max(5)
      .optional()
      .allow(null)
      .messages({
        "array.max": t("instructions.max") + " 5",
      }),
    titleUk: Joi.string()
      .min(1)
      .max(250)
      .messages({
        "string.empty": t("title.name") + t("common.required"),
        "any.required": t("title.name") + t("common.required"),
        "string.min":
          t("title.name") + t("common.min") + " 1 " + t("common.symbol"),
        "string.max":
          t("title.name") + t("common.max") + " 250 " + t("common.symbol"),
      }),
    titleRu: Joi.string()
      .min(1)
      .max(250)
      .messages({
        "string.empty": t("title.name") + t("common.required"),
        "any.required": t("title.name") + t("common.required"),
        "string.min":
          t("title.name") + t("common.min") + " 1 " + t("common.symbol"),
        "string.max":
          t("title.name") + t("common.max") + " 250 " + t("common.symbol"),
      }),
    tag: Joi.string()
      .min(1)
      .max(300)
      .messages({
        "string.empty": t("tag.name") + t("common.required"),
        "any.required": t("tag.name") + t("common.required"),
        "string.min":
          t("tag.name") + t("common.min") + " 1 " + t("common.symbol"),
        "string.max":
          t("tag.name") + t("common.max") + " 300 " + t("common.symbol"),
      }),
    country: Joi.string()
      .min(1)
      .max(100)
      .empty("")
      .allow(null)
      .default(null)
      .messages({
        "string.empty": t("country.name") + t("common.required"),
        "any.required": t("country.name") + t("common.required"),
        "string.min":
          t("country.name") + t("common.min") + " 1 " + t("common.symbol"),
        "string.max":
          t("country.name") + t("common.max") + " 100 " + t("common.symbol"),
      }),
    brand: Joi.string()
      .min(1)
      .max(300)
      .empty("")
      .allow(null)
      .default(null)
      .messages({
        "string.empty": t("brand.name") + t("common.required"),
        "any.required": t("brand.name") + t("common.required"),
        "string.min":
          t("brand.name") + t("common.min") + " 1 " + t("common.symbol"),
        "string.max":
          t("brand.name") + t("common.max") + " 300 " + t("common.symbol"),
      }),
    descriptionUk: Joi.array()
      .items(Joi.object().unknown(true))
      .min(1)
      .required()
      .messages({
        "array.base": t("description.base"),
        "array.min": t("description.min"),
      }),
    descriptionRu: Joi.array()
      .items(Joi.object().unknown(true))
      .min(1)
      .required()
      .messages({
        "array.base": t("description.base"),
        "array.min": t("description.min"),
      }),
    price: Joi.number()
      .min(0)
      .empty("")
      .required()
      .messages({
        "number.min": t("price.name") + t("common.min") + " 0 ",
        "any.required": t("price.name") + t("common.required"),
      }),
    discountPrice: Joi.number()
      .min(0)
      .allow(null)
      .empty("")
      .messages({
        "number.min": t("discountPrice.name") + t("common.min") + " 0 ",
      }),
    category: Joi.string()
      .empty("")
      .valid(...Object.values(EGoodsCategory))
      .required()
      .messages({
        "any.required": t("category.name") + t("common.required"),
      }),
    currency: Joi.string()
      .empty("")
      .valid(...Object.values(ECurrency))
      .required()
      .messages({
        "any.required": t("currency.name") + t("common.required"),
      }),
    badge: Joi.string()
      .valid(...Object.values(EBadgeType))
      .empty("")
      .allow(null)
      .default(null)
      .messages({
        "any.required": t("badge.name") + t("common.required"),
      }),
    specs: Joi.alternatives().conditional("category", {
      switch: [
        {
          is: EGoodsCategory.PANEL,
          then: Joi.custom(
            joiJsonCheck(panelSpecSchema.optional().allow(null))
          ),
        },
        {
          is: EGoodsCategory.INVERTOR,
          then: Joi.custom(
            joiJsonCheck(invertorSpecSchema.optional().allow(null))
          ),
        },
        {
          is: EGoodsCategory.BATTERY,
          then: Joi.custom(
            joiJsonCheck(batterySpecSchema.optional().allow(null))
          ),
        },
        {
          is: EGoodsCategory.FASTENER,
          then: Joi.custom(
            joiJsonCheck(fastenerSpecSchema.optional().allow(null))
          ),
        },
        {
          is: EGoodsCategory.CHARGE_STATION,
          then: Joi.custom(
            joiJsonCheck(chargeStationSpecSchema.optional().allow(null))
          ),
        },
        {
          is: EGoodsCategory.READY_MADE_SOLUTION,
          then: Joi.custom(
            joiJsonCheck(readyMadeSolutionSpecSchema.optional().allow(null))
          ),
        },
        {
          is: EGoodsCategory.COMPONENT,
          then: Joi.custom(
            joiJsonCheck(Joi.object({}).unknown(false).optional().allow(null))
          ),
        },
      ],
      otherwise: Joi.forbidden(),
    }),
  });

export const goodsUpdateSchema = (t: TranslatorType) =>
  goodsSchema(t).keys({
    cover: Joi.object()
      .instance(File)
      .allow(null)
      .optional()
      .messages({
        "object.base": t("images.base"),
      }),
  });
