import envConfig from "./env.config";

export const API_URL_BASE = `${envConfig.SERVER_PROTOCOL}://${envConfig.SERVER_HOST}`;
export const API_URL = API_URL_BASE + "/api";

export const API_ROUTES = {
  auth: {
    login: "/auth/login",
    check: "/auth/check",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },
};
