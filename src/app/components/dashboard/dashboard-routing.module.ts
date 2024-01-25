import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import {AuthCheckGuard} from "../../shared/guards/auth-check.guard";


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'default',
        component: DashboardComponent,
        data: {
          title: "Tableau De Bord",
          breadcrumb: "Tableau De Bord"
        },
        canActivate: [AuthCheckGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
