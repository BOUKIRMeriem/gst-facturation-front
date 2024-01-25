import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DirtyCheckGuard implements CanDeactivate<DirtyComponent> {
  canDeactivate(
    component: DirtyComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (component.canDeactivate()) {
      return confirm('Vous avez apporté des modifications à la page. Si vous quittez, vous perdrez vos modifications');
    } else {
      return true;
    }
  }

}

export interface DirtyComponent {
  canDeactivate (): boolean | Observable<boolean>;
}
