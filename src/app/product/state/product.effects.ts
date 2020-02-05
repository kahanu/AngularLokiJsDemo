import { Injectable } from '@angular/core';
import { Store, select, Action } from '@ngrx/store';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { withLatestFrom, filter, mergeMap, map, catchError, tap } from 'rxjs/operators';
import { allProductsLoadedSelector } from './product.selectors';
import { Product } from '../product';
import { LokiProductService } from '../loki-product.service';
import * as productActions from './product.actions';
import * as actionTypes from './product.action-types';
import { ProductState } from './product.reducer';

@Injectable({
  providedIn: 'root'
})
export class ProductEffects {

  constructor(private productService: LokiProductService,
              private actions$: Actions,
              private store: Store<ProductState>) { }

  @Effect()
  loadProducts$: Observable<Action> = this.actions$.pipe(
    ofType(actionTypes.ProductActions.Load),
    withLatestFrom(this.store.pipe(select(allProductsLoadedSelector))),
    filter(([action, allProductsLoaded]) => !allProductsLoaded),
    mergeMap(action =>
      this.productService.getAll().pipe(
        map(products => (productActions.LoadSuccess({products}))),
        catchError(err => of(productActions.LoadFail(err)))
      )
    )
  );

  @Effect()
  updateProduct$: Observable<Action> = this.actions$.pipe(
    ofType(actionTypes.ProductActions.UpdateProduct),
    map((action) => action.product),
    mergeMap((p: Product) =>
      this.productService.update(p).pipe(
        map(updatedProduct => (productActions.UpdateProductSuccess({
          updatedProduct: {
            id: updatedProduct.id, changes: updatedProduct
          }
        }))),
        catchError(err => of(productActions.UpdateProductFail(err)))
      )
    )
  );

  @Effect()
  createProduct$: Observable<Action> = this.actions$.pipe(
    ofType(actionTypes.ProductActions.CreateProduct),
    map((action) => action.product),
    mergeMap((product: Product) => this.productService.insert(product).pipe(
        map(newProduct => (productActions.CreateProductSuccess({newProduct}))),
        catchError(err => of(productActions.CreateProductFail(err)))
      )
    )
  );

  @Effect()
  deleteProduct$: Observable<Action> = this.actions$.pipe(
    ofType(actionTypes.ProductActions.DeleteProduct),
    map((action) => action.id),
    mergeMap((productId: number) =>
      this.productService.delete(productId).pipe(
        map(() => (productActions.DeleteProductSuccess({productId}))),
        catchError(err => of(productActions.DeleteProductFail(err)))
      )
    )
  );

}
