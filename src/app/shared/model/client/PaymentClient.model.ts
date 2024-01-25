import { FactureClientModel} from './factureClient.model';
import {Client} from './Client.model';

export class PaymentClient {

  id: string;
  deadline: Date;
  tier: string;
  bank: string;
  date: Date;
  designation: string;
  amount: number;
  factureClient?: FactureClientModel;
  client?: Client;
  verified: boolean;
  type: string;
  year?: number;
}
