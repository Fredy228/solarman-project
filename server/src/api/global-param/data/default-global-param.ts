import { ECurrency, LocalizedContent } from '@prisma/client';

import {
  EPageType,
  type TCalculatorProfit,
} from 'src/common/types/global-param/calculator-profit.type';
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
      [ECurrency.UAH]: 42,
      [ECurrency.EUR]: 0.85,
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
      phone: '380000000000',
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
        [EPageType.DEFAULT]: {
          HYBRID: { min: 3, max: 40 },
          NETWORK: { min: 5, max: 300 },
        },
        [EPageType.ENTERPRISE]: {
          HYBRID: { min: 3, max: 40 },
          NETWORK: { min: 30, max: 300 },
        },
        [EPageType.HOME]: {
          HYBRID: { min: 3, max: 30 },
          NETWORK: { min: 3, max: 30 },
        },
        [EPageType.INCOME]: {
          HYBRID: { min: 3, max: 40 },
          NETWORK: { min: 30, max: 300 },
        },
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
          { breakPoint: 0, rate: 90000 },
          { breakPoint: 15, rate: 87500 },
          { breakPoint: 21, rate: 85000 },
        ],
        NETWORK: [
          { breakPoint: 0, rate: 70000 },
          { breakPoint: 15, rate: 67500 },
          { breakPoint: 21, rate: 65000 },
          { breakPoint: 41, rate: 62500 },
          { breakPoint: 80, rate: 60000 },
          { breakPoint: 110, rate: 55000 },
          { breakPoint: 160, rate: 50000 },
          { breakPoint: 200, rate: 45000 },
          { breakPoint: 325, rate: 40000 },
        ],
      },
    },
  },
};
