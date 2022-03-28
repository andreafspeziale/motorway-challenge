import { HttpStatus } from '@nestjs/common';
import { Exception } from '../../common/exceptions';
import { EventExceptionCode, EventExceptionMessage } from './exceptions.interfaces';

export const eventsHttpExceptionMap = {
  EventWrongTypeException: {
    code: EventExceptionCode.WrongTypeException,
    message: EventExceptionMessage.WrongTypeException,
    httpStatus: HttpStatus.CONFLICT,
  },
  EventEntranceExitException: {
    code: EventExceptionCode.EntranceExitException,
    message: EventExceptionMessage.EntranceExitException,
    httpStatus: HttpStatus.CONFLICT,
  },
  EventConstraintsViolationException: {
    code: EventExceptionCode.ConstraintsViolation,
    message: EventExceptionMessage.ConstraintsViolation,
    httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
  },
};

export class EventWrongTypeException extends Exception {}
export class EventEntranceExitException extends Exception {}
export class EventConstraintsViolationException extends Exception {}
