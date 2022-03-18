import { EventExceptionCode, EventExceptionMessage } from './exceptions.interfaces';

export const eventExceptionExamples = {
  WrongTypeException: {
    summary: 'Entrance or exit Event type order exception',
    value: {
      code: EventExceptionCode.WrongTypeException,
      message: EventExceptionMessage.WrongTypeException,
    },
  },
  EntranceExitException: {
    summary: 'Entry or exit Event from same Node exception',
    value: {
      code: EventExceptionCode.EntranceExitException,
      message: EventExceptionMessage.EntranceExitException,
    },
  },
  ConstraintsViolation: {
    summary: 'Invalid Device or Node id',
    value: {
      code: EventExceptionCode.ConstraintsViolation,
      message: EventExceptionMessage.ConstraintsViolation,
    },
  },
};
