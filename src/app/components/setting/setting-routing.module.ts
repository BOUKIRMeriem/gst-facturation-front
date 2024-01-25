import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthCheckGuard } from '../../shared/guards/auth-check.guard';
import { ListAccountComponent } from './account/list-account/list-account.component';

const routes: Routes = [
  {
    path: 'list-account',
    component: ListAccountComponent,
    data: {
      title: 'List Comptes',
      breadcrumb: 'List Comptes'
    },
    canActivate: [AuthCheckGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
