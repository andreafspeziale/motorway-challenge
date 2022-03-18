import { Exception } from '../../common/exceptions';
import { BillExceptionMessage } from './exceptions.interfaces';

export class BillIncompletedTravels extends Exception {}

export const throwBillIncompletedTravels = (): never => {
  throw new BillIncompletedTravels({
    message: BillExceptionMessage.IncompletedTravels,
  });
};
