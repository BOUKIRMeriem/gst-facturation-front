import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Client } from '../../model/client/client.model';
import {FactureClientModel} from "../../model/client/FactureClient.model";
import {tap} from "rxjs/operators";
import { saveAs } from 'file-saver'; // Import saveAs

@Injectable({
  providedIn: 'root'
})
export class FactureClientService {

  private _refresh = new Subject<void>();
  get refresh() {
    return this._refresh;
  }
  url = '/api/facture-client/';

  constructor(private httpClient: HttpClient) { }

  getAll(clientId: string): Observable<FactureClientModel[]> {
    return this.httpClient.get<FactureClientModel[]>(environment.apiEndPoint + this.url + 'list/' + clientId);
  }

  add(facture: FactureClientModel): Observable<FactureClientModel> {
    return this.httpClient.post<FactureClientModel>(environment.apiEndPoint + this.url , facture).pipe(
      tap(() => {this._refresh.next(); })
    );
  }

  getCount(): Observable<any> {
    return this.httpClient.get<any>(environment.apiEndPoint + this.url + 'count');
  }

  edit(facture: FactureClientModel, factureId: string) {
    return this.httpClient.put<Client>(environment.apiEndPoint + this.url + `${factureId}`, facture).pipe(
      tap(() => {this._refresh.next(); })
    );
  }

  findById(id: string): Observable<FactureClientModel> {
    return this.httpClient.get<FactureClientModel>(environment.apiEndPoint  + this.url + `${id}`);
  }

  delete(id: string): Observable<FactureClientModel> {
    return this.httpClient.delete<FactureClientModel>(environment.apiEndPoint + this.url + `${id}`).pipe(
      tap(() => {this._refresh.next(); })
    );
  }

  verifiedFacture(factureId: string): Observable<FactureClientModel> {
    return this.httpClient.get<FactureClientModel>(environment.apiEndPoint + this.url + `verified/${factureId}`).pipe(
      tap(() => {this._refresh.next(); })
    );
  }

  unverifiedFacture(factureId: string): Observable<FactureClientModel> {
    return this.httpClient.get<FactureClientModel>(environment.apiEndPoint + this.url + `unverified/${factureId}`).pipe(
      tap(() => {this._refresh.next(); })
    );
  }

  printFacture(factureId: string): any {
    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
    };
    return this.httpClient.get<any>(environment.apiEndPoint + this.url + 'print/' + factureId, httpOptions);
  }

  download(facture: FactureClientModel): any {
    this.httpClient.get(environment.apiEndPoint + this.url + 'print/' + facture.id , { responseType: 'arraybuffer' })
      .subscribe(data => {
        const blob = new Blob([data], { type: 'application/pdf' });
        saveAs(blob, facture.client.name + '_FC N°_' + facture.numPiece);
      });
  }
  getTotalTTC(): Observable<any> {
    return this.httpClient.get<any>(environment.apiEndPoint + this.url + 'totalTTC');
  }
}
