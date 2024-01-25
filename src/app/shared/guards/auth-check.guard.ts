import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthentificationService } from '../service/authentification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthCheckGuard implements CanActivate {

  constructor(private authService: AuthentificationService, private router: Router) {
    authService.loadUserData();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if ( this.authService.isRefreshTokenExpired() ) {
      localStorage.clear();
      this.authService.logout();
      this.router.navigate(['/authentification/connexion']);
      return false;
    }
    return true;
  }
}
