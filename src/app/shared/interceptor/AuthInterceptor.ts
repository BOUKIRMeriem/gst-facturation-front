import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { AuthentificationService } from '../service/authentification.service';
import { JwtHelperService } from '../service/jwt-helper.service';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

const TOKEN_HEADER_KEY = 'Authorization';
const CSRF_COOKIE_NAME = 'XSRF-TOKEN';
const CSRF_HEADER_NAME = 'X-XSRF-TOKEN';
const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = 'refreshToken';
const TOKEN_EXPIRED_MSG = 'The Token has expired';
export interface Token {
  accessToken: string;
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthentificationService,
    private jwtHelper: JwtHelperService
    ) {}

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject(null);


  private static addTokenHeader(request: HttpRequest<any>, token: string, type: string) {

    if ( type === ACCESS_TOKEN){
      return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, token) });
    }
    else if (type === REFRESH_TOKEN){
      return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, token) });
    }
  }

  intercept( request: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
    let authReq: HttpRequest<any> = request;
    const token = this.jwtHelper.getToken();
    if ( token != null && authReq.url.includes( '/api/' )) {
      authReq = AuthInterceptor.addTokenHeader( request, token, ACCESS_TOKEN );
    }
    return next.handle( authReq ).pipe( catchError( ( error: HttpErrorResponse ) => {

      let errMessage: string = '';
      if ( authReq.url.includes('/api/') ) {
        errMessage = error.error.message;
      }

      if ( error && error.status === 401 && !authReq.url.includes( '/api/login' ) && authReq.url.includes( '/api/' ) && errMessage.includes( TOKEN_EXPIRED_MSG ) ) {

        return this.handle401ErrorTokenExpired( authReq, next );
      }

      return throwError( error );
    }));
  }



  private handle401ErrorTokenExpired(request: HttpRequest<any>, next: HttpHandler) {
    if ( !this.isRefreshing ) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next( null );
      const token = this.jwtHelper.getRefreshToken();
      console.log("Requesting for new token");

        if ( token ) {
          return this.authService.refreshAuthToken( token ).pipe(
            switchMap( ( receivedToken: Token ) => {
              this.isRefreshing = false;
              this.jwtHelper.saveToken( receivedToken.accessToken );
              this.refreshTokenSubject.next( receivedToken.accessToken );
              return next.handle( AuthInterceptor.addTokenHeader( request, receivedToken.accessToken, ACCESS_TOKEN ) );
            }),
          catchError( err => {
            this.isRefreshing = false;
            return throwError(err);
          })
        );
      }
    }
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap( ( token ) => next.handle( AuthInterceptor.addTokenHeader( request, token, ACCESS_TOKEN ) ) )
    );
  }
}
