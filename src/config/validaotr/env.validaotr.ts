import * as Joi from 'joi';

export const envValidator = Joi.object({
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.string().required(),
  DATABASE_DEFAULT: Joi.string().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_TYPE: Joi.string().valid('mysql', 'mariadb', 'postgresql'),
  ACCESS_TOKEN_EXPIRE: Joi.string().required(),
  ACCESS_SUBJECT: Joi.string().required(),
  REFRESH_TOKEN_EXPIRE: Joi.string().required(),
  REFRESH_SUBJECT: Joi.string().required(),
  TOKEN_SECRET: Joi.string().required(),
  ISSUER: Joi.string().required(),
}).unknown(); // allow unknow field except field in validator
