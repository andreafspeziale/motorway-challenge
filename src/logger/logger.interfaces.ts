export enum LoggerLevel {
  Silent = 'silent',
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Http = 'http',
  Verbose = 'verbose',
  Debug = 'debug',
}

export interface LoggerConfig {
  level: LoggerLevel;
  pretty?: boolean;
  redact?: string[];
}

export interface LogMetadata {
  fn: string;
  [key: string]: any;
}

export type LogLevel = Exclude<LoggerLevel, LoggerLevel.Silent>;

export interface LogInfo extends LogMetadata {
  context: string;
  reqId: string;
  level: LogLevel;
  message: string;
  timestamp: string;
}
