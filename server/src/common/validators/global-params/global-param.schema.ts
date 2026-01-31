import Joi from 'joi';
import { EGlobalParam } from 'src/common/enums/global-param/global-param.enum';
import {
  globalParamCalculatorProfitSchema,
  globalParamContactsSchema,
  globalParamExchangeRateSchema,
} from './global-param-items.schema';

export const globalParamSchema = Joi.object({
  name: Joi.string()
    .valid(...Object.values(EGlobalParam))
    .required(),
  value: Joi.alternatives().conditional('name', {
    switch: [
      {
        is: EGlobalParam.EXCHANGE_RATE,
        then: globalParamExchangeRateSchema,
      },
      {
        is: EGlobalParam.CONTACTS,
        then: globalParamContactsSchema,
      },
      {
        is: EGlobalParam.CALCULATOR_PROFIT,
        then: globalParamCalculatorProfitSchema,
      },
    ],
    otherwise: Joi.forbidden(),
  }),
});
