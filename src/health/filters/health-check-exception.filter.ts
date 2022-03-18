import { Catch, ArgumentsHost, ServiceUnavailableException } from '@nestjs/common';
import { HealthCheckResult } from '@nestjs/terminus';
import { LoggerService } from '../../logger/logger.service';
import { Request, Response } from '../../common/interfaces';
import { HttpExceptionsFilter } from '../../common/exceptions';
import { httpErrorStatusCodeDescription } from '../../common/exceptions/http-exceptions.utils';

@Catch(ServiceUnavailableException)
export class HealthCheckExceptionFilter extends HttpExceptionsFilter {
  constructor(protected readonly logger: LoggerService) {
    super(logger);

    this.logger.setContext(HealthCheckExceptionFilter.name);
  }

  catch(exception: ServiceUnavailableException, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    const healthCheckResult = exception.getResponse() as HealthCheckResult;
    const status = exception.getStatus();

    this.log(
      request,
      {
        code: `HTTP.${status}`,
        message: httpErrorStatusCodeDescription(status),
        details: healthCheckResult.details,
      },
      exception.stack
    );

    response.status(status).json(healthCheckResult);
  }
}
