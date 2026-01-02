import Joi from "joi";
import {
  EBatterySpecType,
  EFastenerSpecType,
  EInvertorSpecType,
  EMaterialType,
  EPanelSpecType,
} from "../features/goods";

export const panelSpecSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(EPanelSpecType))
    .empty("")
    .allow(null)
    .default(null)
    .optional(),
  power: Joi.number().min(1).allow(null).empty("").default(null).optional(),
}).unknown(false);

export const invertorSpecSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(EInvertorSpecType))
    .empty("")
    .allow(null)
    .default(null)
    .optional(),
  power: Joi.number().min(1).allow(null).empty("").default(null).optional(),
  phase: Joi.number()
    .valid(1, 3)
    .allow(null)
    .empty("")
    .default(null)
    .optional(),
}).unknown(false);

export const batterySpecSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(EBatterySpecType))
    .empty("")
    .allow(null)
    .default(null)
    .optional(),
  capacity: Joi.number().min(1).allow(null).empty("").default(null).optional(),
  voltage: Joi.number().min(1).allow(null).empty("").default(null).optional(),
}).unknown(false);

export const fastenerSpecSchema = Joi.object({
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

export const chargeStationSpecSchema = Joi.object({
  power: Joi.number().min(0.01).allow(null).empty("").default(null).optional(),
}).unknown(false);

export const readyMadeSolutionSpecSchema = Joi.object({
  power: Joi.number().min(0.01).allow(null).empty("").default(null).optional(),
}).unknown(false);
