import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Client } from '../../model/client/client.model';

@Injectable({
    providedIn: 'root'
})
export class ClientService {

    url = '/api/client/';

    constructor(private httpClient: HttpClient) { }

    getAll(): Observable<Client[]> {
      return this.httpClient.get<Client[]>(environment.apiEndPoint + this.url);
    }

    add(client: Client): Observable<Client> {
        return this.httpClient.post<Client>(environment.apiEndPoint + this.url , client);
    }

    getCount(): Observable<any> {
        return this.httpClient.get<any>(environment.apiEndPoint + this.url + 'count');
    }

    edit(client: Client, clientId: string) {
        return this.httpClient.put<Client>(environment.apiEndPoint + this.url + `${clientId}`, client);
    }

    findById(id: string): Observable<Client> {
        return this.httpClient.get<Client>(environment.apiEndPoint  + this.url + `${id}`);
    }

    delete(id: string): Observable<Client> {
        return this.httpClient.delete<Client>(environment.apiEndPoint + this.url + `delete/${id}`);
    }
}
