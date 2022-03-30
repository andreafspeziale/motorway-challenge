import { LoggerConfig } from '../logger/logger.interfaces';

export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export interface ServiceMetadata {
  name: string;
  version: string;
}

export interface ServerConfig {
  host?: string;
  port: number;
}

export interface DbConfig {
  type: 'postgres';
  host: string;
  port: number;
  database: string;
  schema: string;
  synchronize: boolean;
  migrationsRun: boolean;
  migrationsFolder: string;
  username: string;
  password?: string;
  ssl?: {
    ca: string;
    cert: string;
    key: string;
  };
}

export interface Config {
  service: ServiceMetadata;
  env: NodeEnv;
  server: ServerConfig;
  logger: LoggerConfig;
  db: DbConfig;
}
