import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../shared/models';
import { map, tap } from 'rxjs/operators';
import { LokiCustomerService } from '../core/services/loki-customer.service';
import { FormGroup, FormBuilder } from '@angular/forms';

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
    // this.updateCustomer();
    this.loadCustomer();
    // this.deleteCustomer({ id: 5 });
    // this.insertCustomer();
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
      tap(r => console.log('all: ', r)),
      map(response => response as Customer[])
    );
  }

  loadCustomer() {
    this.customerService
      .getById(3)
      .subscribe(c => console.log('loaded customer: ', c));
  }

  updateCustomer() {
    let c: Customer;
    this.customerService.getById(1).subscribe(cust => {
      c = cust;
      console.log('c to update: ', c);
      c.lastName = 'Winston';
      this.customerService
        .update(c)
        .subscribe(customer => console.log('updated customer: ', customer));
    });
  }

  deleteCustomer(query: any) {
    this.customerService.deleteEntity(query);
  }

  insertCustomer() {
    const c: Customer = new Customer();
    c.id = 5;
    c.firstName = 'King';
    c.lastName = 'Wilder';
    c.address = 'Golf Center Dr.';

    this.customerService.insert(c);
  }

  selectedCustomer(e: any) {
    console.log('selected customer: ', e.target.value);
    this.customerService.getById(+e.target.value).subscribe(customer => {
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
