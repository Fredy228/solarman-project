import envConfig from "./env.config";

export const API_URL = `${envConfig.SERVER_PROTOCOL}://${envConfig.SERVER_HOST}/api`;
