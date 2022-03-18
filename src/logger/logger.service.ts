import { Injectable, Scope, LoggerService as ILoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as rTracer from 'cls-rtracer';
import { Logger } from 'winston';
import { Config } from '../config';
import { isKeyValueObject } from '../common/utils';
import { LoggerConfig, LoggerLevel, LogMetadata, LogLevel } from './logger.interfaces';
import { createLogger } from './logger.utils';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements ILoggerService {
  private readonly logger: Logger;
  private context?: string;

  constructor(private readonly configService: ConfigService<Config>) {
    const loggerConfig = this.configService.get<LoggerConfig>('logger');

    this.logger = createLogger(loggerConfig);
  }

  setContext(context: string): void {
    this.context = context;
  }

  log(message: string, context?: string): void;
  log(message: string, metadata?: LogMetadata, context?: string): void;
  log(message: string, ...optionalParams: any[]): void {
    const metadata = this.getLogMetadata(optionalParams);

    this.writeLog(LoggerLevel.Info, message, metadata);
  }

  error(message: string, stack?: string, context?: string): void;
  error(message: string, metadata?: LogMetadata, stack?: string, context?: string): void;
  error(message: string, ...optionalParams: any[]): void {
    const metadata = this.getErrorLogMetadata(optionalParams);

    this.writeLog(LoggerLevel.Error, message, metadata);
  }

  warn(message: string, context?: string): void;
  warn(message: string, metadata?: LogMetadata, context?: string): void;
  warn(message: string, ...optionalParams: any[]): void {
    const metadata = this.getLogMetadata(optionalParams);

    this.writeLog(LoggerLevel.Warn, message, metadata);
  }

  http(message: string, context?: string): void;
  http(message: string, metadata?: LogMetadata, context?: string): void;
  http(message: string, ...optionalParams: any[]): void {
    const metadata = this.getLogMetadata(optionalParams);

    this.writeLog(LoggerLevel.Http, message, metadata);
  }

  verbose(message: string, context?: string): void;
  verbose(message: string, metadata?: LogMetadata, context?: string): void;
  verbose(message: string, ...optionalParams: any[]): void {
    const metadata = this.getLogMetadata(optionalParams);

    this.writeLog(LoggerLevel.Verbose, message, metadata);
  }

  debug(message: string, context?: string): void;
  debug(message: string, metadata?: LogMetadata, context?: string): void;
  debug(message: string, ...optionalParams: any[]): void {
    const metadata = this.getLogMetadata(optionalParams);

    this.writeLog(LoggerLevel.Debug, message, metadata);
  }

  private getLogMetadata(args: unknown[]): Record<string, any> {
    let metadata: Record<string, any> = {
      context: this.context,
    };

    if (!args.length) {
      return metadata;
    }

    if (typeof args[0] === 'object') {
      metadata = {
        ...args[0],
        ...metadata,
      };
    }

    const lastArgument = args[args.length - 1];
    const isContext = typeof lastArgument === 'string';

    if (isContext) {
      metadata = {
        ...metadata,
        context: `${this.context ? `${this.context}:` : ''}${lastArgument}`,
      };
    }

    return metadata;
  }

  private getErrorLogMetadata(args: unknown[]): Record<string, any> {
    let metadata: Record<string, any> = {
      context: this.context,
    };

    if (!args.length) {
      return metadata;
    }

    if (typeof args[0] === 'object') {
      metadata = {
        ...args[0],
        ...metadata,
      };
    }

    const lastArgument = args[args.length - 1];
    const nextToLastArgument = args[args.length - 2];
    const isStack = typeof lastArgument === 'string' && typeof nextToLastArgument !== 'string';
    const isContext = typeof lastArgument === 'string' && typeof nextToLastArgument === 'string';

    if (isStack) {
      metadata = {
        ...metadata,
        stack: [lastArgument],
      };
    }

    if (isContext) {
      metadata = {
        ...metadata,
        stack: [nextToLastArgument],
        context: `${this.context ? `${this.context}:` : ''}${lastArgument}`,
      };
    }

    return metadata;
  }

  private redactLogMetadata(metadata: Record<string, any>): Record<string, any> {
    const loggerConfig = this.configService.get<LoggerConfig>('logger');

    return Object.keys(metadata).reduce((acc: Record<string, any>, key: string) => {
      const data = metadata[key];

      if (data) {
        if (loggerConfig.redact.includes(key)) {
          return {
            ...acc,
            [key]: '*******',
          };
        }

        if (isKeyValueObject(data)) {
          return {
            ...acc,
            [key]: Array.isArray(data)
              ? data.map((value) =>
                  isKeyValueObject(value) ? this.redactLogMetadata(value) : value
                )
              : this.redactLogMetadata(data),
          };
        }
      }

      return {
        ...acc,
        [key]: data,
      };
    }, {});
  }

  private writeLog(level: LogLevel, message: string, metadata: Record<string, any>): void {
    const { context, fn, ...restMetadata } = metadata;
    const reqId = rTracer.id();

    const loggerConfig = this.configService.get<LoggerConfig>('logger');

    this.logger[level](message, {
      context: context || 'N/A',
      ...(fn ? { fn } : {}),
      ...(loggerConfig.redact?.length ? this.redactLogMetadata(restMetadata) : restMetadata),
      ...(reqId ? { reqId } : {}),
    });
  }
}
