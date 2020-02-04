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

export interface ProductDialogData {
  product: Product;
  mode: string;
}

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductDialogData
  ) { }

  ngOnInit() {
    this.initForm(this.data.product);
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
    const formVal = this.form.value;
    console.log('formval: ', formVal);
    this.data.product = {...this.data.product, ...formVal};
    console.log('product: ', this.data.product);
    this.dialogRef.close(this.data.product);
  }

  cancel() {
    // this.clearCurrent.emit();
    this.dialogRef.close();
  }
}
