import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../state/product.reducer';
import { Observable } from 'rxjs';
import { Product } from '../../product';
import * as productSelectors from '../../state/product.selectors';
import * as productActions from '../../state/product.actions';
import { MatDialog } from '@angular/material/dialog';
import { ProductEditComponent } from '../../presentation/product-edit/product-edit.component';

@Component({
  selector: 'app-product-shell',
  templateUrl: './product-shell.component.html',
  styleUrls: ['./product-shell.component.scss']
})
export class ProductShellComponent implements OnInit {
  products$: Observable<Product[]>;
  selectedProduct$: Observable<Product>;
  product: Product;

  constructor(
    private store: Store<fromStore.ProductState>,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.store.dispatch(productActions.Load());
    this.products$ = this.store.pipe(select(productSelectors.getProducts));
    this.selectedProduct$ = this.store.pipe(
      select(productSelectors.getCurrentProduct)
    );
  }

  addNew() {
    this.store.dispatch(productActions.InitializeCurrentProduct());
    this.selectedProduct$.subscribe(prod => {
      this.dialog.open(ProductEditComponent, {
        disableClose: true,
        data: {
          product: prod
        }
      });
    });
  }

  editProduct(p: Product) {
    console.log('editing product: ', p);
  }

  deleteProduct(p: Product) {
    console.log('deleting product: ', p);
  }
}
