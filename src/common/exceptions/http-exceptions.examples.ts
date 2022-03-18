export const httpExceptionExamples = {
  ValidationException: {
    summary: 'Validation exception',
    value: {
      code: 'HTTP.400',
      message: 'Bad Request',
      details: ['validation error detail'],
    },
  },
  UnauthorizedException: {
    summary: 'Unauthorized exception',
    value: {
      code: 'HTTP.401',
      message: 'Unauthorized',
    },
  },
  ForbiddenException: {
    summary: 'Forbidden exception',
    value: {
      code: 'HTTP.403',
      message: 'Forbidden',
    },
  },
  NotFoundException: {
    summary: 'Not found exception',
    value: {
      code: 'HTTP.404',
      message: 'Not Found',
    },
  },
};
