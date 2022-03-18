import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Exception, HttpException } from '../../common/exceptions';
import { eventsHttpExceptionMap } from '../exceptions/exceptions';

@Injectable()
export class EventsExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err: unknown) =>
        throwError(() =>
          err instanceof Exception
            ? new HttpException(
                {
                  code: eventsHttpExceptionMap[err.name].code,
                  message: eventsHttpExceptionMap[err.name].message,
                },
                eventsHttpExceptionMap[err.name].httpStatus
              )
            : err
        )
      )
    );
  }
}
