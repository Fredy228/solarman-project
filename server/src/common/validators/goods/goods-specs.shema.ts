import Joi from 'joi';

import {
  EBatterySpecType,
  EFastenerSpecType,
  EInvertorSpecType,
  EPanelSpecType,
} from '../../enums/goods/spec-type.emum';
import { EMaterialType } from '../../enums/goods/spec-material.enum';

export const panelSpecSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(EPanelSpecType))
    .optional(),
  power: Joi.number().min(1).max(9999999).optional(),
}).unknown(false);

export const invertorSpecSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(EInvertorSpecType))
    .optional(),
  power: Joi.number().min(1).max(9999999).optional(),
  phase: Joi.number().valid(1, 3).optional(),
}).unknown(false);

export const batterySpecSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(EBatterySpecType))
    .optional(),
  capacity: Joi.number().min(1).max(9999999).optional(),
  voltage: Joi.number().min(1).max(9999999).optional(),
}).unknown(false);

export const fastenerSpecSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(EFastenerSpecType))
    .optional(),
  material: Joi.string()
    .valid(...Object.values(EMaterialType))
    .optional(),
}).unknown(false);

export const chargeStationSpecSchema = Joi.object({
  power: Joi.number().min(0.01).max(9999999).optional(),
}).unknown(false);

export const readyMadeSolutionSpecSchema = Joi.object({
  power: Joi.number().min(0.01).max(9999999).optional(),
}).unknown(false);
