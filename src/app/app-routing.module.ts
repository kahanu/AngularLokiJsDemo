import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from './shared/layout/app-layouts/main-layout/main-layout.component';
import { FixedTopLayoutComponent } from './shared/layout/app-layouts/fixed-top-layout/fixed-top-layout.component';
import {
  FixedSettingsLayoutComponent
} from './shared/layout/app-layouts/fixed-top-layout/fixed-settings-layout/fixed-settings-layout.component';

const routes: Routes = [
  {
    path: '',
    component: FixedTopLayoutComponent,
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      {
        path: 'about',
        loadChildren: () =>
          import('./about/about.module').then(m => m.AboutModule)
      },
      {
        path: 'customers',
        loadChildren: () =>
          import('./customers/customers.module').then(m => m.CustomersModule)
      },
      {
        path: 'info',
        loadChildren: () => import('./info/info.module').then(m => m.InfoModule)
      },
      {
        path: 'help',
        loadChildren: () => import('./help/help.module').then(m => m.HelpModule)
      },
      {
        path: 'products',
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule)
      }
    ]
  },
  {
    path: 'settings',
    component: FixedSettingsLayoutComponent,
    loadChildren: () =>
      import('./settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: 'home',
    component: FixedTopLayoutComponent,
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: '**',
    component: FixedTopLayoutComponent,
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
