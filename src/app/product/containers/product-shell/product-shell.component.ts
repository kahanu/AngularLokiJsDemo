import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '../../state/product.reducer';

@Component({
  selector: 'app-product-shell',
  templateUrl: './product-shell.component.html',
  styleUrls: ['./product-shell.component.scss']
})
export class ProductShellComponent implements OnInit {

  constructor(private store: Store<fromStore.ProductState>) { }

  ngOnInit() {
  }

}
