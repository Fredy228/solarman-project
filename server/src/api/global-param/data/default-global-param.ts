import { ECurrency, LocalizedContent } from '@prisma/client';

import { EGlobalParam } from '../../../common/enums/global-param/global-param.enum';

type DefaultGlobalParam = {
  value: Record<string, unknown>;
  title: LocalizedContent;
  description: LocalizedContent;
};

export const defaultGlobalParam: Record<EGlobalParam, DefaultGlobalParam> = {
  [EGlobalParam.EXCHANGE_RATE]: {
    value: {
      [ECurrency.UAH]: 1,
    },
    title: {
      uk: 'Курс валюти',
      ru: 'Курс валюты',
    },
    description: {
      uk: 'Курс валюти по відношенню до долара',
      ru: 'Курс валюты по отношению к доллару',
    },
  },
};
