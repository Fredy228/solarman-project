import Joi from 'joi';
import { BadgeType, ECurrency, GoodsCategory } from '@prisma/client';

import {
  batterySpecSchema,
  chargeStationSpecSchema,
  fastenerSpecSchema,
  invertorSpecSchema,
  panelSpecSchema,
  readyMadeSolutionSpecSchema,
} from './goods-specs.schema';
import { joiJsonCheck } from '../../../helpers/joi/joi-json-check.util';

export const goodsSchema = Joi.object({
  title: Joi.string().min(2).max(250),
  tag: Joi.string().min(2).max(300),
  country: Joi.string().min(1).max(100),
  brand: Joi.string().min(1).max(300),
  description: Joi.string(),
  price: Joi.number().min(0),
  discountPrice: Joi.number().min(0),
  category: Joi.string().valid(...Object.values(GoodsCategory)),
  currency: Joi.string().valid(...Object.values(ECurrency)),
  badge: Joi.string().valid(...Object.values(BadgeType)),
  specs: Joi.alternatives().conditional('category', {
    switch: [
      {
        is: GoodsCategory.PANEL,
        then: Joi.custom(joiJsonCheck(panelSpecSchema.optional().allow(null))),
      },
      {
        is: GoodsCategory.INVERTOR,
        then: Joi.custom(
          joiJsonCheck(invertorSpecSchema.optional().allow(null)),
        ),
      },
      {
        is: GoodsCategory.BATTERY,
        then: Joi.custom(
          joiJsonCheck(batterySpecSchema.optional().allow(null)),
        ),
      },
      {
        is: GoodsCategory.FASTENER,
        then: Joi.custom(
          joiJsonCheck(fastenerSpecSchema.optional().allow(null)),
        ),
      },
      {
        is: GoodsCategory.CHARGE_STATION,
        then: Joi.custom(
          joiJsonCheck(chargeStationSpecSchema.optional().allow(null)),
        ),
      },
      {
        is: GoodsCategory.READY_MADE_SOLUTION,
        then: Joi.custom(
          joiJsonCheck(readyMadeSolutionSpecSchema.optional().allow(null)),
        ),
      },
      {
        is: GoodsCategory.COMPONENT,
        then: Joi.custom(
          joiJsonCheck(Joi.object({}).unknown(false).optional().allow(null)),
        ),
      },
    ],
    otherwise: Joi.forbidden(),
  }),
});
