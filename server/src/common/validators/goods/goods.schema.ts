import Joi from 'joi';

import { GoodsCategory } from '@prisma/client';

import {
  batterySpecSchema,
  chargeStationSpecSchema,
  fastenerSpecSchema,
  invertorSpecSchema,
  panelSpecSchema,
  readyMadeSolutionSpecSchema,
} from './goods-specs.shema';

export const goodsSchema = Joi.object({
  title: Joi.string().min(2).max(250),
  tag: Joi.string().min(2).max(300),
  country: Joi.string().min(1).max(100),
  brand: Joi.string().min(1).max(300),
  description: Joi.string(),
  price: Joi.number().min(0).max(9999999),
  category: Joi.string().valid(...Object.values(GoodsCategory)),
  specs: Joi.alternatives().conditional('category', {
    switch: [
      { is: GoodsCategory.PANEL, then: panelSpecSchema.optional().allow(null) },
      {
        is: GoodsCategory.INVERTOR,
        then: invertorSpecSchema.optional().allow(null),
      },
      {
        is: GoodsCategory.BATTERY,
        then: batterySpecSchema.optional().allow(null),
      },
      {
        is: GoodsCategory.FASTENER,
        then: fastenerSpecSchema.optional().allow(null),
      },
      {
        is: GoodsCategory.CHARGE_STATION,
        then: chargeStationSpecSchema.optional().allow(null),
      },
      {
        is: GoodsCategory.READY_MADE_SOLUTION,
        then: readyMadeSolutionSpecSchema.optional().allow(null),
      },
      {
        is: GoodsCategory.COMPONENT,
        then: Joi.object({}).unknown(false).optional().allow(null),
      },
    ],
    otherwise: Joi.forbidden(),
  }),
});
