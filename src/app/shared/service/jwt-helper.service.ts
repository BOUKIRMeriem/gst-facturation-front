import { Injectable } from '@angular/core';
import jwtDecode, {JwtPayload} from 'jwt-decode';
import { User } from '../model/user.model';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';



@Injectable({
  providedIn: 'root'
})
export class JwtHelperService {

  private token: string;
  private decodedJwt: any;
  public usersRoles: string[];
  private activeUser: User;
  constructor() {
    if (this.getUser()) { this.decodeJwt(); }
  }


  signOut(): void {
    localStorage.clear();
  }

  public saveToken(token: string): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    const user = this.getUser();
    if (user) {
      this.saveUser({ ...user, accessToken: token });
    }
  }
  public getToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  public saveRefreshToken(token: string): void {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  public saveUser(user: User): void {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }


  public decodeJwt(){
    this.token = this.getToken().substring('Kpixo.'.length);
    this.decodedJwt = jwtDecode(this.token);
    this.usersRoles = this.decodedJwt.roles;
  }

  public isRefreshTokenExpired(): boolean{
    const rToken = this.getRefreshToken();
    if (rToken) {
      const decodedToken: JwtPayload = jwtDecode(rToken.substring('Bearer '.length));
      const exp = decodedToken.exp;
      return Date.now() >= (exp * 1000);
    }
    return true;
  }

  public getActiveUserRoles(){
    return this.usersRoles
    ;
  }
}
