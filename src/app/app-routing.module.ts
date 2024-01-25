import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { content } from './shared/routes/content-routes';
import { ContentLayoutComponent } from './shared/layout/content-layout/content-layout.component';
import {ConnexionComponent} from "./components/authentification/connexion/connexion.component";
import {NoAuthCheckGuard} from "./shared/guards/no-auth-check.guard";
import {AuthCheckGuard} from "./shared/guards/auth-check.guard";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/default',
    pathMatch: 'full'
  },
  {
    path: '',
    component: ContentLayoutComponent,
    canActivate: [AuthCheckGuard],
    children: content
  },{
    path: 'authentification/connexion',
    component: ConnexionComponent,
    canActivate: [NoAuthCheckGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
