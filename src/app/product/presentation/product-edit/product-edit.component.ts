import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject
} from '@angular/core';
import { Product } from '../../product';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  // @Input() errorMessage: string;
  // @Input() selectedProduct: Product;
  // @Output() save = new EventEmitter<Product>();
  // @Output() delete = new EventEmitter<Product>();
  // @Output() clearCurrent = new EventEmitter<void>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductEditComponent>,
    @Inject(MAT_DIALOG_DATA) public product: Product
  ) { }

  ngOnInit() {
    this.initForm(this.product);
  }

  initForm(m?: Product) {
    this.form = this.fb.group({
      id: [m ? m.id : 0],
      name: [m ? m.name : ''],
      sku: [m ? m.sku : ''],
      price: [m ? m.price : 0]
    });
  }

  saveProduct() {
    // this.save.emit(this.form.value);
  }

  cancel() {
    // this.clearCurrent.emit();
    this.dialogRef.close();
  }
}
