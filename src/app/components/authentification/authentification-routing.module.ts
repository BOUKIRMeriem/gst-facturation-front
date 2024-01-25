import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoAuthCheckGuard } from 'src/app/shared/guards/no-auth-check.guard';
import { ConnexionComponent } from './connexion/connexion.component';



const routes: Routes = [
  {
    path: 'connexion',
    component: ConnexionComponent,
    canActivate: [NoAuthCheckGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthentificationRoutingModule { }
