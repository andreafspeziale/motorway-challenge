import { User } from '../users/entities';

interface Period {
  from: Date;
  to: Date;
}

export interface BillPayload {
  user: User;
  period: Period;
  costKm: number;
}
