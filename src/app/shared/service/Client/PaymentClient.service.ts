import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import { environment } from 'src/environments/environment';
import {tap} from 'rxjs/operators';
import {PaymentClient} from '../../model/client/PaymentClient.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentClientService {

  private _refresh = new Subject<void>();
  get refresh() {
    return this._refresh;
  }
  url = '/api/payment-client/';

  constructor(private httpClient: HttpClient) { }

  getAllPayments(clientId: string): Observable<PaymentClient[]> {
    return this.httpClient.get<PaymentClient[]>(environment.apiEndPoint + this.url + `list/${clientId}`);
  }

  getAllPaymentClientsByFacture(factureId: string): Observable<PaymentClient[]> {
    return this.httpClient.get<PaymentClient[]>(environment.apiEndPoint + this.url + `facture/${factureId}`);
  }

  verifiedPaymentClient(paymentClientId: string): Observable<PaymentClient> {
    return this.httpClient.get<PaymentClient>(environment.apiEndPoint + this.url + `verified/${paymentClientId}`).pipe(
      tap(() => {this._refresh.next(); })
    );
  }

  unverifiedPaymentClient(paymentClientId: string): Observable<PaymentClient> {
    return this.httpClient.get<PaymentClient>(environment.apiEndPoint + this.url + `unverified/${paymentClientId}`).pipe(
      tap(() => {this._refresh.next(); })
    );
  }

  addPaymentClient(paymentClient: PaymentClient): Observable<PaymentClient> {
    return this.httpClient.post<PaymentClient>(environment.apiEndPoint + this.url , paymentClient).pipe(
      tap(() => {this._refresh.next(); })
    );
  }


  editPaymentClient(paymentClient: PaymentClient, paymentClientId: string) {
    return this.httpClient.put<PaymentClient>(environment.apiEndPoint + this.url + `${paymentClientId}`, paymentClient).pipe(
      tap(() => {this._refresh.next(); })
    );
  }


  findPaymentClientById(id: string): Observable<PaymentClient> {
    return this.httpClient.get<PaymentClient>(environment.apiEndPoint  + this.url + `${id}`);
  }

  deletePaymentClientById(id: string): Observable<PaymentClient> {
    return this.httpClient.delete<PaymentClient>(environment.apiEndPoint + this.url + id).pipe(
      tap(() => {this._refresh.next(); })
    );
  }

}
