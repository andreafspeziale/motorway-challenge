import { LoggerLevel } from '../logger/logger.interfaces';
import { Config, NodeEnv } from './config.interfaces';

export * from './config.interfaces';
export * from './config.schema';

export default (): Config => ({
  service: {
    name: process.env.npm_package_name,
    version: process.env.npm_package_version,
  },
  env: process.env.NODE_ENV as NodeEnv,
  server: {
    host: process.env.HOST,
    port: parseInt(process.env.PORT, 10),
  },
  logger: {
    level: process.env.LOGGER_LEVEL as LoggerLevel,
    pretty: process.env.LOGGER_PRETTY === 'true',
    redact: process.env.LOGGER_REDACT?.split(','),
  },
  db: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_DATABASE,
    synchronize: false,
    migrationsRun: true,
    migrationsFolder: process.env.DB_MIGRATIONS_FOLDER,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
});
