import * as Joi from 'joi';

export const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').required(),
  PORT_SERVER: Joi.number().default(3000),
  DB_HOST: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  CORS_ORIGIN: Joi.string().optional().allow(null).allow(''),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRE_ACCESS_TOKEN: Joi.string()
    .pattern(/^\d+([smhd])$/)
    .message('Must be a number followed by one of: s, m, h, d')
    .default('30m'),
  JWT_EXPIRE_REFRESH_TOKEN: Joi.string()
    .pattern(/^\d+([smhd])$/)
    .message('Must be a number followed by one of: s, m, h, d')
    .default('7d'),
  SALT_ROUNDS: Joi.number().integer().min(1).default(10),
  COOKIES_EXPIRE: Joi.number()
    .integer()
    .default(7 * 24 * 60 * 60),
  TOKEN_KEY_CRM: Joi.string().default('').allow(''),
  TELEGRAM_TOKEN: Joi.string().default('').allow(''),
  TELEGRAM_CHAT_ID: Joi.string().default('').allow(''),
});
