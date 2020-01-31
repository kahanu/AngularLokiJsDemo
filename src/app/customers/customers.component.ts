import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../shared/models';
import { map } from 'rxjs/operators';
import { LokiCustomerService } from '../core/services/loki-customer.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import uuid from 'uuid';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers$: Observable<Customer[]>;
  form: FormGroup;
  selected: boolean;
  customer: Customer;

  constructor(
    private customerService: LokiCustomerService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.loadCustomers();
    this.initForm(this.customer);
  }

  initForm(c?: Customer) {
    this.form = this.fb.group({
      id: [c ? c.id : 0],
      firstName: [c ? c.firstName : ''],
      lastName: [c ? c.lastName : ''],
      address: [c ? c.address : '']
    });
  }

  loadCustomers() {
    this.customers$ = this.customerService.getAll().pipe(
      map(response => response as Customer[])
    );
  }

  selectedCustomer(e: any) {
    this.customerService.getById(e.target.value).subscribe(customer => {
      if (customer) {
        this.initForm(customer);
        this.selected = true;
      }
    });
  }

  addNew() {
    this.initForm();
    this.selected = true;
  }

  delete() {
    if (confirm('Are you sure you want to delete this customer?')) {
      const customer = this.form.value;
      this.customerService.delete(customer.id).subscribe(() => {
        this.loadCustomers();
        this.selected = false;
      });
    }
  }

  save() {
    const customer = this.form.value as Customer;
    if (customer.id === 0) {
      customer.id = uuid();
      this.customerService.insert(customer).subscribe(c => {
        this.loadCustomers();
        this.selected = false;
      });
    } else {
      this.customerService.update(customer).subscribe(c => {
        if (c) {
          this.loadCustomers();
          this.selected = false;
        }
      });
    }
  }
}
