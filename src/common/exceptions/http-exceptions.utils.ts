import { HttpExceptionExceptionResponse } from './http-exception';

export const httpErrorStatusCodes: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable',
  417: 'Expectation Failed',
  418: "I'm a teapot",
  421: 'Misdirected Request',
  422: 'Unprocessable Entity',
  423: 'Locked',
  424: 'Failed Dependency',
  425: 'Too Early',
  426: 'Upgrade Required',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  451: 'Unavailable For Legal Reasons',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates',
  507: 'Insufficient Storage',
  508: 'Loop Detected',
  510: 'Not Extended',
  511: 'Network Authentication Required',
};

export const httpErrorStatusCodeDescription = (status: number): string =>
  httpErrorStatusCodes[status] || 'Unknown error';

export const isExceptionResponse = (response: any): response is HttpExceptionExceptionResponse => {
  const { code, message, details } = response;

  return (
    typeof response === 'object' &&
    response !== null &&
    !Array.isArray(response) &&
    typeof code === 'string' &&
    typeof message === 'string' &&
    (!details ||
      (Array.isArray(details) && details.every((detail) => typeof detail === 'string')) ||
      (!Array.isArray(details) && typeof details === 'object'))
  );
};

export const toExceptionResponse = (
  response: string | any[] | Record<string, any>,
  status: number
): HttpExceptionExceptionResponse => {
  if (isExceptionResponse(response)) {
    return response;
  }

  if (typeof response === 'string') {
    return {
      code: `HTTP.${status}`,
      message: response,
    };
  }

  if (Array.isArray(response)) {
    return {
      code: `HTTP.${status}`,
      message: httpErrorStatusCodeDescription(status),
      details: response,
    };
  }

  const { statusCode, message, error, ...rest } = response;

  if (Array.isArray(message)) {
    return {
      code: rest.code || `HTTP.${status}`,
      message: error || httpErrorStatusCodeDescription(status),
      details: message,
    };
  }

  return {
    code: rest.code || `HTTP.${status}`,
    message: message || error || httpErrorStatusCodeDescription(status),
    details: rest.details,
  };
};
