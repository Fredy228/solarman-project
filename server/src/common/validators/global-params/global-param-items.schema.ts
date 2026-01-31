import Joi from 'joi';

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

export const globalParamCalculatorProfitSchema = Joi.object({
  min_max_range_power: Joi.object({
    HYBRID: Joi.object({
      min: Joi.number().required(),
      max: Joi.number().required(),
    }).required(),
    NETWORK: Joi.object({
      min: Joi.number().required(),
      max: Joi.number().required(),
    }).required(),
  }).optional(),
  range_power: Joi.object({
    HYBRID: Joi.array()
      .items(
        Joi.object({
          breakPoint: Joi.number().required(),
          step: Joi.number().required(),
        }),
      )
      .required(),
    NETWORK: Joi.array()
      .items(
        Joi.object({
          breakPoint: Joi.number().required(),
          step: Joi.number().required(),
        }),
      )
      .required(),
  }).optional(),
  range_rate_per_kwh: Joi.object({
    HYBRID: Joi.array()
      .items(
        Joi.object({
          breakPoint: Joi.number().required(),
          rate: Joi.number().required(),
        }),
      )
      .required(),
    NETWORK: Joi.array()
      .items(
        Joi.object({
          breakPoint: Joi.number().required(),
          rate: Joi.number().required(),
        }),
      )
      .required(),
  }).optional(),
  station_operating_time: Joi.object({
    HYBRID: Joi.object({
      min: Joi.number().required(),
      max: Joi.number().required(),
    }).required(),
    NETWORK: Joi.object({
      min: Joi.number().required(),
      max: Joi.number().required(),
    }).required(),
  }).optional(),
  tariff: Joi.object({
    min: Joi.number().required(),
    max: Joi.number().required(),
  }).optional(),
});
