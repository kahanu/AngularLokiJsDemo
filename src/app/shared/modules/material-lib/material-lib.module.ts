import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    MatDialogModule,
    MatInputModule
  ],
  exports: [
    MatDialogModule,
    MatInputModule
  ]
})
export class MaterialLibModule { }
