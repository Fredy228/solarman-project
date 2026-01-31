import { ECurrency, LocalizedContent } from '@prisma/client';

import type { TCalculatorProfit } from 'src/common/types/global-param/calculator-profit.type';
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
  [EGlobalParam.CALCULATOR_PROFIT]: DefaultGlobalParam<TCalculatorProfit>;
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
  [EGlobalParam.CALCULATOR_PROFIT]: {
    title: {
      uk: 'Параметри калькулятора',
      ru: 'Параметры калькулятора',
    },
    description: {
      uk: 'Параметри для розрахунку прибутковості сонячних електростанцій',
      ru: 'Параметры для расчета прибыльности солнечных электростанций',
    },
    value: {
      min_max_range_power: {
        HYBRID: { min: 3, max: 40 },
        NETWORK: { min: 3, max: 300 },
      },
      range_power: {
        HYBRID: [
          { breakPoint: 0, step: 1 },
          { breakPoint: 10, step: 5 },
          { breakPoint: 30, step: 10 },
        ],
        NETWORK: [
          { breakPoint: 0, step: 1 },
          { breakPoint: 10, step: 5 },
        ],
      },
      range_rate_per_kwh: {
        HYBRID: [
          { breakPoint: 0, rate: 900 },
          { breakPoint: 15, rate: 875 },
          { breakPoint: 21, rate: 850 },
        ],
        NETWORK: [
          { breakPoint: 0, rate: 700 },
          { breakPoint: 15, rate: 675 },
          { breakPoint: 21, rate: 650 },
          { breakPoint: 41, rate: 625 },
          { breakPoint: 80, rate: 600 },
          { breakPoint: 110, rate: 550 },
          { breakPoint: 160, rate: 500 },
          { breakPoint: 200, rate: 450 },
          { breakPoint: 325, rate: 400 },
        ],
      },
      station_operating_time: {
        HYBRID: { min: 10, max: 50 },
        NETWORK: { min: 10, max: 50 },
      },
      tariff: { min: 4, max: 50 },
    },
  },
};
