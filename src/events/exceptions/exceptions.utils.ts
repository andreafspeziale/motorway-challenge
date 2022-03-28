import {
  EventConstraintsViolationException,
  EventEntranceExitException,
  EventWrongTypeException,
} from './exceptions';
import { EventExceptionMessage } from './exceptions.interfaces';

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
