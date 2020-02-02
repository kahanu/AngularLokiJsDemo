import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromProducts from './product.reducer';

export interface State {
  products: fromProducts.ProductState;
}

// Selector functions
const selectProductsState = createFeatureSelector<fromProducts.ProductState>('products');

export const getCurrentProductId = createSelector(
    selectProductsState,
    state => state.currentProductId
);

export const getCurrentProduct = createSelector(
    selectProductsState,
    getCurrentProductId,
    (productState, currentProductId) => {
      if (currentProductId === 0) {
        return {
          id: 0,
          productName: '',
        };
      } else {
        return currentProductId ? productState.entities[currentProductId] : null;
      }
    }
);

export const getProducts = createSelector(
    selectProductsState,
    fromProducts.selectAllProducts
);

export const getError = createSelector(
    selectProductsState,
    state => state.error
);

export const allProductsLoadedSelector = createSelector(
  selectProductsState,
  state => state.allProductsLoaded
);
