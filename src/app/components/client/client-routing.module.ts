import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListClientComponent } from './list-client/list-client.component';
import { AddClientComponent } from './add-client/add-client.component';
import {ListFactureComponent} from "./facture/list-facture/list-facture.component";
import { ListAllPaymentComponent } from './list-all-payment/list-all-payment.component';
import {AuthCheckGuard} from "../../shared/guards/auth-check.guard";

const routes: Routes = [
  {
    path: 'list-client',
    component: ListClientComponent,
    data: {
      title: 'List Client',
      breadcrumb: 'List Client'
    },
    canActivate: [AuthCheckGuard]
  },
  {
    path: 'list-facture',
    component: ListFactureComponent,
    data: {
      title: 'List Facture Client',
      breadcrumb: 'List Facture Client'
    },
    canActivate: [AuthCheckGuard]
  },
  {
    path: 'list-payment',
    component: ListAllPaymentComponent,
    data: {
      title: 'List Reglement Client',
      breadcrumb: 'List Reglement Client'
    },
    canActivate: [AuthCheckGuard]
  },
  {
    path: 'add-client',
    component: AddClientComponent,
    data: {
      title: 'Ajouter Un Client',
      breadcrumb: 'Ajouter Un Client'
    },
    canActivate: [AuthCheckGuard]
  },
  {
    path: 'edit-client/:id',
    component: AddClientComponent,
    data: {
      title: 'Modifier Un Client',
      breadcrumb: 'Modifier Un Client'
    },
    canActivate: [AuthCheckGuard]
  },
  {
    path: 'edit-client/:page/:id',
    component: AddClientComponent,
    data: {
      title: 'Modifier Un Client',
      breadcrumb: 'Modifier Un Client'
    },
    canActivate: [AuthCheckGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
