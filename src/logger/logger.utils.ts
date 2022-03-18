import * as winston from 'winston';
import { LoggerConfig, LoggerLevel } from './logger.interfaces';

export const createLogger = (config: LoggerConfig): winston.Logger => {
  const formats = [winston.format.timestamp(), winston.format.json()];
  if (config.pretty) {
    formats.push(winston.format.prettyPrint({ colorize: true }));
  }

  return winston.createLogger({
    level: config.level,
    format: winston.format.combine(...formats),
    transports: [new winston.transports.Console()],
    silent: config.level === LoggerLevel.Silent,
  });
};
