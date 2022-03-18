import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express'; // eslint-disable-line import/no-extraneous-dependencies
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(LoggerMiddleware.name);
  }

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, baseUrl, url, query, body } = request;

    this.logger.log('Incoming request...', {
      fn: this.use.name,
      request: {
        route: `${method} ${baseUrl || url.replace(/\?.*/, '')}`,
        query,
        ...(['POST', 'PUT', 'PATCH'].includes(method) ? { body } : {}),
      },
    });

    next();
  }
}
