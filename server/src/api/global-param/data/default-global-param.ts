import { ECurrency, LocalizedContent } from '@prisma/client';

import type { TContacts } from 'src/common/types/global-param/contacts.type';
import type { TExchangeRates } from 'src/common/types/global-param/exchange-rate.type';
import { EGlobalParam } from '../../../common/enums/global-param/global-param.enum';

type DefaultGlobalParam<T> = {
  value: T;
  title: LocalizedContent;
  description: LocalizedContent;
};

interface GlobalParamType {
  [EGlobalParam.EXCHANGE_RATE]: DefaultGlobalParam<TExchangeRates>;
  [EGlobalParam.CONTACTS]: DefaultGlobalParam<TContacts>;
}

export const defaultGlobalParam: GlobalParamType = {
  [EGlobalParam.EXCHANGE_RATE]: {
    value: {
      [ECurrency.UAH]: 1,
      [ECurrency.EUR]: 1,
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
  [EGlobalParam.CONTACTS]: {
    value: {
      phone: '+380000000000',
      email: 'email@example.com',
      address: {
        uk: 'Ваша адреса тут',
        ru: 'Ваш адрес здесь',
      },
      link_google_maps: null,
      link_facebook: null,
      link_instagram: null,
      link_telegram: null,
      link_youtube: null,
    },
    title: {
      uk: 'Контакти',
      ru: 'Контакты',
    },
    description: {
      uk: 'Контактна інформація компанії',
      ru: 'Контактная информация компании',
    },
  },
};
