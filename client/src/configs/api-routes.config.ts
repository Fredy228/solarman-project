import envConfig from "./env.config";

export const API_URL = `${envConfig.SERVER_PROTOCOL}://${envConfig.SERVER_HOST}/api`;

export const API_ROUTES = {
  auth: {
    login: "/auth/login",
    check: "/auth/check",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },
};
