import { EGlobalParam } from "../shared/types/global-param.enum";
import envConfig from "./env.config";

export const API_URL_BASE = `${envConfig.SERVER_PROTOCOL}://${envConfig.SERVER_HOST}`;
export const API_URL = API_URL_BASE + "/api";

export const API_LIMITS_ITEMS = {
  portfolio: 12,
  blog: 12,
  goods: 12,
};

export const API_ROUTES = {
  auth: {
    login: "/auth/login",
    check: "/auth/check",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },
  user: {
    list: "/user",
    update: (id: string) => `/user/${id}`,
    get: (id: string) => `/user/${id}`,
  },
  hashtag: {
    list: "/hashtag",
  },
  portfolio: {
    list: "/portfolio",
    get: (id: string) => `/portfolio/${id}`,
    getByTag: (tag: string) => `/portfolio/tag/${tag}`,
  },
  blog: {
    list: "/blog",
    get: (id: string) => `/blog/${id}`,
    getByTag: (tag: string) => `/blog/tag/${tag}`,
  },
  goods: {
    list: "/goods",
    filters: (category: string) => `/goods/filters/${category}`,
    getByTag: (tag: string) => `/goods/tag/${tag}`,
  },
  globalParams: {
    contacts: `/global-param/${EGlobalParam.CONTACTS}`,
    calculatorProfit: `/global-param/${EGlobalParam.CALCULATOR_PROFIT}`,
    exchangeRate: `/global-param/${EGlobalParam.EXCHANGE_RATE}`,
  },
  order: {
    send: "/order/public",
  },
};
