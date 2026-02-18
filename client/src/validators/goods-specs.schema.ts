import Joi from "joi";
import {
  EBatterySpecType,
  EFastenerSpecType,
  EInvertorSpecType,
  EMaterialType,
  EPanelSpecType,
} from "../features/goods";
import { TranslatorType } from "../i18n/types";

export const panelSpecSchema = (t: TranslatorType) =>
  Joi.object({
    type: Joi.string()
      .valid(...Object.values(EPanelSpecType))
      .empty("")
      .allow(null)
      .default(null)
      .optional(),
    power: Joi.number()
      .min(1)
      .allow(null)
      .empty("")
      .default(null)
      .optional()
      .messages({
        "number.min": t("power.name") + t("common.min") + " 1",
        "number.base": t("power.base"),
      }),
  }).unknown(false);

export const invertorSpecSchema = (t: TranslatorType) =>
  Joi.object({
    type: Joi.string()
      .valid(...Object.values(EInvertorSpecType))
      .empty("")
      .allow(null)
      .default(null)
      .optional(),
    power: Joi.number()
      .min(1)
      .allow(null)
      .empty("")
      .default(null)
      .optional()
      .messages({
        "number.min": t("power.name") + t("common.min") + " 1",
        "number.base": t("power.base"),
      }),
    phase: Joi.number()
      .valid(1, 3)
      .allow(null)
      .empty("")
      .default(null)
      .optional()
      .messages({
        "any.only": t("phase.name") + t("common.valid") + " 1, 3",
      }),
  }).unknown(false);

export const batterySpecSchema = (t: TranslatorType) =>
  Joi.object({
    type: Joi.string()
      .valid(...Object.values(EBatterySpecType))
      .empty("")
      .allow(null)
      .default(null)
      .optional(),
    capacity: Joi.number()
      .min(1)
      .allow(null)
      .empty("")
      .default(null)
      .optional()
      .messages({
        "number.min": t("capacity.name") + t("common.min") + " 1",
        "number.base": t("capacity.base"),
      }),
    voltage: Joi.number()
      .min(1)
      .allow(null)
      .empty("")
      .default(null)
      .optional()
      .messages({
        "number.min": t("voltage.name") + t("common.min") + " 1",
        "number.base": t("voltage.base"),
      }),
  }).unknown(false);

export const fastenerSpecSchema = () =>
  Joi.object({
    type: Joi.string()
      .valid(...Object.values(EFastenerSpecType))
      .empty("")
      .allow(null)
      .default(null)
      .optional(),
    material: Joi.string()
      .valid(...Object.values(EMaterialType))
      .empty("")
      .allow(null)
      .default(null)
      .optional(),
  }).unknown(false);

export const chargeStationSpecSchema = (t: TranslatorType) =>
  Joi.object({
    power: Joi.number()
      .min(0.01)
      .allow(null)
      .empty("")
      .default(null)
      .optional()
      .messages({
        "number.min": t("power.name") + t("common.min") + " 0.01",
        "number.base": t("power.base"),
      }),
  }).unknown(false);

export const readyMadeSolutionSpecSchema = (t: TranslatorType) =>
  Joi.object({
    power: Joi.number()
      .min(0.01)
      .allow(null)
      .empty("")
      .default(null)
      .optional()
      .messages({
        "number.min": t("power.name") + t("common.min") + " 0.01",
        "number.base": t("power.base"),
      }),
  }).unknown(false);
