import Joi from 'joi';
import {
  EPageType,
  EStationType,
} from 'src/common/types/global-param/calculator-profit.type';

export const globalParamContactsSchema = Joi.object({
  phone: Joi.string().min(5).max(30).optional(),
  email: Joi.string().email().optional(),
  address: Joi.object({
    uk: Joi.string().min(1).max(500).optional(),
    ru: Joi.string().min(1).max(500).optional(),
  }).optional(),
  link_google_maps: Joi.string().uri().allow(null).optional(),
  link_facebook: Joi.string().uri().allow(null).optional(),
  link_instagram: Joi.string().uri().allow(null).optional(),
  link_telegram: Joi.string().uri().allow(null).optional(),
  link_youtube: Joi.string().uri().allow(null).optional(),
});

export const globalParamExchangeRateSchema = Joi.object({
  UAH: Joi.number().optional(),
  EUR: Joi.number().optional(),
});

const calculatorMinMaxRangeSchema = Joi.object({
  min: Joi.number().required(),
  max: Joi.number().required(),
});

const calculatorMinMaxRangePowerSchema = Joi.object({
  [EStationType.HYBRID]: calculatorMinMaxRangeSchema.required(),
  [EStationType.NETWORK]: calculatorMinMaxRangeSchema.required(),
});

export const globalParamCalculatorProfitSchema = Joi.object({
  min_max_range_power: Joi.object({
    [EPageType.DEFAULT]: calculatorMinMaxRangePowerSchema.required(),
    [EPageType.ENTERPRISE]: calculatorMinMaxRangePowerSchema.required(),
    [EPageType.HOME]: calculatorMinMaxRangePowerSchema.required(),
    [EPageType.INCOME]: calculatorMinMaxRangePowerSchema.required(),
  }).optional(),
  range_power: Joi.object({
    [EStationType.HYBRID]: Joi.array()
      .items(
        Joi.object({
          breakPoint: Joi.number().required(),
          step: Joi.number().required(),
        }),
      )
      .required(),
    [EStationType.NETWORK]: Joi.array()
      .items(
        Joi.object({
          breakPoint: Joi.number().required(),
          step: Joi.number().required(),
        }),
      )
      .required(),
  }).optional(),
  range_rate_per_kwh: Joi.object({
    [EStationType.HYBRID]: Joi.array()
      .items(
        Joi.object({
          breakPoint: Joi.number().required(),
          rate: Joi.number().required(),
        }),
      )
      .required(),
    [EStationType.NETWORK]: Joi.array()
      .items(
        Joi.object({
          breakPoint: Joi.number().required(),
          rate: Joi.number().required(),
        }),
      )
      .required(),
  }).optional(),
  station_operating_time: Joi.object({
    [EStationType.HYBRID]: calculatorMinMaxRangeSchema.required(),
    [EStationType.NETWORK]: calculatorMinMaxRangeSchema.required(),
  }).optional(),
  tariff: calculatorMinMaxRangeSchema.optional(),
});
