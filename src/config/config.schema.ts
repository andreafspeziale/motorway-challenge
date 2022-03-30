import * as Joi from 'joi';
import { LoggerLevel } from '../logger/logger.interfaces';
import { NodeEnv } from './config.interfaces';

export const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...Object.values(NodeEnv))
    .required(),
  HOST: Joi.string(),
  PORT: Joi.number().required(),
  LOGGER_LEVEL: Joi.string()
    .valid(...Object.values(LoggerLevel))
    .required(),
  LOGGER_PRETTY: Joi.boolean(),
  LOGGER_REDACT: Joi.string(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_DATABASE: Joi.string().required(),
  DB_SCHEMA: Joi.string().default('public'),
  DB_MIGRATIONS_FOLDER: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_SSL_ENABLED: Joi.boolean().required(),
  DB_PASSWORD: Joi.string()
    .when('DB_SSL_ENABLED', { is: true, then: Joi.forbidden() })
    .when('DB_SSL_ENABLED', { is: false, then: Joi.required() }),
  DB_SSL_CA: Joi.string()
    .when('DB_SSL_ENABLED', { is: true, then: Joi.required() })
    .when('DB_SSL_ENABLED', { is: false, then: Joi.forbidden() }),
  DB_SSL_CERT: Joi.string()
    .when('DB_SSL_ENABLED', { is: true, then: Joi.required() })
    .when('DB_SSL_ENABLED', { is: false, then: Joi.forbidden() }),
  DB_SSL_KEY: Joi.string()
    .when('DB_SSL_ENABLED', { is: true, then: Joi.required() })
    .when('DB_SSL_ENABLED', { is: false, then: Joi.forbidden() }),
});
