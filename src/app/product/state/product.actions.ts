import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Product } from '../product';


export const SetCurrentProduct = createAction('[Product] Set Current Product', props<{product: Product}>());

export const ClearCurrentProduct = createAction('[Product] Clear Current Product');

export const InitializeCurrentProduct = createAction('[Product] Initialize Current Product');

export const Load = createAction('[Product] Load');

export const LoadSuccess = createAction('[Product] Load Success', props<{products: Product[]}>());

export const LoadFail = createAction('[Product] Load Fail', props<{error: string}>());

export const UpdateProduct = createAction('[Product] Update Product', props<{product: Product}>());

export const UpdateProductSuccess = createAction('[Product] Update Product Success', props<{updatedProduct: Update<Product>}>());

export const UpdateProductFail = createAction('[Product] Update Product Fail', props<{error: string}>());

export const CreateProduct = createAction('[Product] Create Product', props<{product: Product}>());

export const CreateProductSuccess = createAction('[Product] Create Product Success', props<{newProduct: Product}>());

export const CreateProductFail = createAction('[Product] Create Product Fail', props<{error: string}>());

export const DeleteProduct = createAction('[Product] Delete Product', props<{id: number}>());

export const DeleteProductSuccess = createAction('[Product] Delete Product Success', props<{productId: number}>());

export const DeleteProductFail = createAction('[Product] Delete Product Fail', props<{error: string}>());
