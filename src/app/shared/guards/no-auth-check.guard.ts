import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthentificationService } from '../service/authentification.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthCheckGuard implements CanActivate {
  constructor(private authService: AuthentificationService, private router: Router, private toasterService: ToastrService){
    authService.loadUserData();
  }

  private getMessageForRouteStates = (route:string) => {
    if (route.startsWith('/authentification/reset')) {
      return "Vous êtes déjà connecté, vous devez d'abord vous déconnecter pour terminer l'opération";
    }
    else {
      return'Vous êtes déjà connecté';
    }
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const message = this.getMessageForRouteStates(state.url.toLowerCase());
      if ( !this.authService.isRefreshTokenExpired() ) {
        this.toasterService.info(message);
        this.router.navigate(['/dashboard']);
        return false;
      }
      return true;
  }

}
