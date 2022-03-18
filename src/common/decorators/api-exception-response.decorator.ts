import { applyDecorators } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';
import {
  ExampleObject,
  ExamplesObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { HttpException } from '../exceptions';

export interface ApiExceptionResponseOptions {
  status: number;
  description?: string;
  example?: ExampleObject['value'];
  examples?: ExamplesObject;
}

export const ApiExceptionResponse = ({
  status,
  description,
  example,
  examples,
}: ApiExceptionResponseOptions) =>
  applyDecorators(
    ApiResponse({
      status,
      description,
      content: {
        'application/json': {
          schema: { $ref: getSchemaPath(HttpException) },
          example,
          examples,
        },
      },
    })
  );
