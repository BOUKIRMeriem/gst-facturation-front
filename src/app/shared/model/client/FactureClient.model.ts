import {Client} from './client.model';
import {DetailFactureClient} from './detailFactureClient.model';

export class FactureClientModel {
  id?: string;
  numPiece?: number;
  numOrigin?: number;
  date?: Date;
  client?: Client;
  totalTTC?: number;
  totalTVA?: number;
  totalHT?: number;
  totalDiscount?: number;
  totalAmountPayment?: number;
  type?: string;
  verified?: boolean;
  year?: number;
  detailsFacture?: Array<DetailFactureClient>;
}
