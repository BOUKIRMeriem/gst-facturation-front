import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthentificationService } from './authentification.service';
import {AccountModel} from '../model/account.model';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  headers = new HttpHeaders();

  url = '/api/account/';
  private _refresh = new Subject<void>();
  get refresh() {
    return this._refresh;
  }

  constructor(private httpClient: HttpClient, private authService: AuthentificationService) {
    this.setHeaders();
  }

  setHeaders(){
    this.authService.loadUserData();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', '*/*');
    this.headers.append('Authorization', this.authService.authToken);
  }

  getAll(): Observable<AccountModel[]> {
    return this.httpClient.get<AccountModel[]>(environment.apiEndPoint + this.url + 'all');
  }

  register(account: AccountModel): Observable<AccountModel>{
    return this.httpClient.post<AccountModel>(environment.apiEndPoint + this.url + 'register', account).pipe(
      tap(() => {this._refresh.next(); })
    );
  }

  edit(id: string, account: AccountModel): Observable<AccountModel>{
    return this.httpClient.put<AccountModel>(environment.apiEndPoint + this.url + `${id}`, account).pipe(
      tap(() => {this._refresh.next(); })
    );
  }

  delete(id: string): Observable<AccountModel>{
    return this.httpClient.delete<AccountModel>(environment.apiEndPoint + this.url + `${id}`).pipe(
      tap(() => {this._refresh.next(); })
    );
  }

  findById(id: string): Observable<AccountModel>{
    return this.httpClient.get<AccountModel>(environment.apiEndPoint + this.url + `${id}`);
  }


}
