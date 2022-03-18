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

class EventWrongTypeException extends Exception {}
class EventEntranceExitException extends Exception {}
class EventConstraintsViolationException extends Exception {}

export const throwEventWrongTypeException = (): never => {
  throw new EventWrongTypeException({
    message: EventExceptionMessage.WrongTypeException,
  });
};

export const throwEventEntranceExitException = (): never => {
  throw new EventEntranceExitException({
    message: EventExceptionMessage.EntranceExitException,
  });
};

export const throwEventConstraintsViolationException = (): never => {
  throw new EventConstraintsViolationException({
    message: EventExceptionMessage.ConstraintsViolation,
  });
};
