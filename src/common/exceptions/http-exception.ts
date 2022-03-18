import { HttpException as NestHttpException } from '@nestjs/common';

export interface HttpExceptionExceptionResponse {
  code: string;
  message: string;
  details?: string[] | Record<string, unknown>;
}

export class HttpException extends NestHttpException {
  constructor(response: HttpExceptionExceptionResponse, status: number) {
    super(response, status);
  }

  code: string;
  message: string;
  details?: string[] | Record<string, unknown>;
}
