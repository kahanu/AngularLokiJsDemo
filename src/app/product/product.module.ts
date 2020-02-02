import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { config } from '../shared/shared.config';

import { StoreModule } from '@ngrx/store';
import { productReducer } from './state/product.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ProductEffects } from './state/product.effects';

import { ProductShellComponent } from './containers/product-shell/product-shell.component';

const productRoutes: Routes = [
  { path: '', component: ProductShellComponent }
];

@NgModule({
  declarations: [ProductShellComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(productRoutes),
    StoreModule.forFeature(config.entities.products, productReducer),
    EffectsModule.forFeature([ProductEffects])
  ]
})
export class ProductModule { }
