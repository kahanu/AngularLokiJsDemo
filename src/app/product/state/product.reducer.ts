import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { Product } from '../product';

import { createReducer, on, Action } from '@ngrx/store';
import * as ProductActions from './product.actions';

// State for this feature (Product)
export interface ProductState extends EntityState<Product> {
  currentProductId: number | null;
  error: string;
  allProductsLoaded: boolean;
}

export const adapter = createEntityAdapter<Product>();

export const initialState = adapter.getInitialState({
  currentProductId: null,
  error: '',
  allProductsLoaded: false
});

const ProductReducer = createReducer(
  initialState,
  on(ProductActions.SetCurrentProduct, (state, action) => ({ ...state, currentProductId: action.product.id })),
  on(ProductActions.ClearCurrentProduct, (state) => ({ ...state, currentProductId: null })),
  on(ProductActions.InitializeCurrentProduct, (state) => ({ ...state, currentProductId: 0 })),
  on(ProductActions.LoadSuccess, (state, {products}) =>  adapter.addAll(products, { ...state, allProductsLoaded: true })),
  on(ProductActions.LoadFail, (state, action) => ({ ...state, products: [], error: action.error })),
  on(ProductActions.UpdateProductSuccess, (state, {updatedProduct}) => adapter.updateOne(updatedProduct, state)),
  on(ProductActions.UpdateProductFail, (state, action) => ({ ...state, product: [], error: action.error})),
  on(ProductActions.CreateProductSuccess, (state, action) => adapter.addOne(action.newProduct, state)),
  on(ProductActions.CreateProductFail, (state, action) => ({ ...state, error: action.error })),
  on(ProductActions.DeleteProductSuccess, (state, action) => adapter.removeOne(action.productId, state)),
  on(ProductActions.DeleteProductFail, (state, action) => ({ ...state, error: action.error }))

);

export function productReducer(state = initialState, action: Action) {
  return ProductReducer(state, action);
}

export const getSelectedProductId = (state: ProductState) => state.currentProductId;

// get the selectors
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

// select the array oftProduct ids
export const selectProductIds = selectIds;

// select the dictionary oftProduct entities
export const selectProductEntities = selectEntities;

// select the array oftProducts
export const selectAllProducts = selectAll;

// select the totaltProduct count
export const selectProductTotal = selectTotal;
