import { Routes } from '@angular/router';

export const content: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../../components/dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'client',
    loadChildren: () => import('../../components/client/client.module').then(m => m.ClientModule),
    data: {
      breadcrumb: 'Client'
    }
  },
  {
    path: 'product',
    loadChildren: () => import('../../components/product/product.module').then(m => m.ProductModule),
    data: {
      breadcrumb: 'Produit'
    }
  },
  {
    path: 'setting',
    loadChildren: () => import('../../components/setting/setting.module').then(m => m.SettingModule),
    data: {
      breadcrumb: 'Paramètre'
    }
  },
];
