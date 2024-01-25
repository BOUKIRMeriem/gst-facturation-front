import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../model/user.model';
import { JwtHelperService } from './jwt-helper.service';

const TOKEN_HEADER_KEY = 'Authorization-r';
const ACCESS_TOKEN = 'accessToken';
const REFRESH_TOKEN = 'refreshToken';
const USER = 'userBilling';
const ACCOUNT = 'account';
@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  authToken: string;
  user: User;
  currentYear: number;
  constructor(private httpClient: HttpClient, private jwtHelper: JwtHelperService) { }

  logout() {
    this.user = new User();
    this.authToken = null;
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(ACCOUNT);
    localStorage.removeItem(USER);
    localStorage.removeItem(REFRESH_TOKEN);
  }

  authenticateUser(user: any): Observable<AuthRepType> {
    return this.httpClient.post<AuthRepType>(environment.apiEndPoint + '/api/login', user);
  }

  refreshAuthToken(token: string){
    const apiURL = `${environment.apiEndPoint}/api/account/token/refresh`;
    const httpHeaders = new HttpHeaders().set(TOKEN_HEADER_KEY, token);
    return this.httpClient.get<any>(apiURL, {
      headers : httpHeaders,
    });
  }

  public isRefreshTokenExpired(){
    return this.jwtHelper.isRefreshTokenExpired();
  }

  storeUserData(accessToken: string, user: User , refreshToken: string) {
    this.getCurrentYear();
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
    localStorage.setItem(USER, JSON.stringify(user));
    this.authToken = accessToken;
    this.user = user;
  }

  getCurrentYear() {
    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear();
  }

  loadUserData(){
    this.authToken = localStorage.getItem(ACCESS_TOKEN);
    this.user = JSON.parse(localStorage.getItem(USER));
  }

  loggedIn(){
    return this.authToken !== null;
  }

}

export interface AuthRepType {
  id: number;
  email: string;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}
