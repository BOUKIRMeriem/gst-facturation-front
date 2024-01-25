import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListProductComponent} from './list-product/list-product.component';
import {AddProductComponent} from './add-product/add-product.component';
import {AuthCheckGuard} from "../../shared/guards/auth-check.guard";


const routes: Routes = [

  {
    path: 'list-product',
    component: ListProductComponent,
    data: {
      title: 'List Produit',
      breadcrumb: 'List Produit'
    },
    canActivate: [AuthCheckGuard]
  },
  {
    path: 'add-product',
    component: AddProductComponent,
    data: {
      title: 'Ajouter un Produit',
      breadcrumb: 'Ajouter un Produit'
    },
    canActivate: [AuthCheckGuard]
  },
  {
    path: 'edit-product/:id',
    component: AddProductComponent,
    data: {
      title: 'Modifier un Produit',
      breadcrumb: 'Modifier un Produit'
    },
    canActivate: [AuthCheckGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
