import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import { environment } from 'src/environments/environment';
import {ProductModel} from "../model/product/product.model";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private _refresh = new Subject<void>();
  get refresh() {
    return this._refresh;
  }

  url = '/api/product/';

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<ProductModel[]> {
    return this.httpClient.get<ProductModel[]>(environment.apiEndPoint + this.url);
  }

  add(product: ProductModel): Observable<ProductModel> {
    return this.httpClient.post<ProductModel>(environment.apiEndPoint + this.url , product).pipe(
      tap(() => {this._refresh.next(); })
    );
  }

  getCount(): Observable<any> {
    return this.httpClient.get<any>(environment.apiEndPoint + this.url + 'count');
  }

  edit(product: ProductModel, productId: string) {
    return this.httpClient.put<ProductModel>(environment.apiEndPoint + this.url + `${productId}`, product).pipe(
      tap(() => {this._refresh.next(); })
    );
  }

  findById(id: string): Observable<ProductModel> {
    return this.httpClient.get<ProductModel>(environment.apiEndPoint  + this.url + `${id}`);
  }

  delete(id: string): Observable<ProductModel> {
    return this.httpClient.delete<ProductModel>(environment.apiEndPoint + this.url + `delete/${id}`).pipe(
      tap(() => {this._refresh.next(); })
    );
  }
}
