import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  @Input() products: Product[];
  @Output() edit = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<Product>();

  constructor() { }

  ngOnInit() {
  }

  editProduct(p: Product) {
    this.edit.emit(p);
  }

  deleteProduct(p: Product) {
    this.delete.emit(p);
  }

}
