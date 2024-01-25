import {FactureClientModel} from './factureClient.model';
import {ProductModel} from "../product/product.model";

export class DetailFactureClient {
  id?: number;
  factureClient?: FactureClientModel;
  product?: ProductModel;
  description?: string;
  tva?: number;
  price?: number;
  quantity?: number;
  total?: number;
}
