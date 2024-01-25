import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuAction } from '../model/MenuAction.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private httpClient: HttpClient) { }

  get_all_menu(): Observable<MenuAction[]>{
    return this.httpClient.get<MenuAction[]>(environment.apiEndPoint+`/menu`);
  }

  get_menu_by_id(id:string): Observable<MenuAction>{
    return this.httpClient.get<MenuAction>(environment.apiEndPoint+`/menu/${id}`);
  }

  add_menu(menu:MenuAction): Observable<MenuAction>{
    return this.httpClient.post<MenuAction>(environment.apiEndPoint+`/menu/`, menu);
  }

  Update_menu(menu:MenuAction): Observable<MenuAction>{
    return this.httpClient.patch<MenuAction>(environment.apiEndPoint+`/menu/${menu.id}`, menu);
  }

  delete_menu(id:string): Observable<MenuAction>{
    return this.httpClient.delete<MenuAction>(environment.apiEndPoint+`/menu/${id}`);
  }
}
