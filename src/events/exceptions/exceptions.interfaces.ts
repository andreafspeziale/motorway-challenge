export enum EventExceptionCode {
  WrongTypeException = 'EVENT.001',
  EntranceExitException = 'EVENT.002',
  ConstraintsViolation = 'EVENT.003',
}

export enum EventExceptionMessage {
  WrongTypeException = 'Cannot entry before exit and vice versa',
  EntranceExitException = 'Cannot entry or exit from the same Node',
  ConstraintsViolation = 'Device or Node constraint violation',
}
