import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../shared/models';
import { map, tap } from 'rxjs/operators';
import { LokiCustomerService } from '../core/services/loki-customer.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  customers$: Observable<Customer[]>;

  constructor(private customerService: LokiCustomerService) { }

  ngOnInit() {
    // this.updateCustomer();
    this.loadCustomer();
    // this.deleteCustomer({ id: 5 });
    // this.insertCustomer();
    this.loadCustomers();
  }

  loadCustomers() {
    this.customers$ = this.customerService.getAll()
      .pipe(
        tap(r => console.log('all: ', r)),
        map(response => response as Customer[]));
  }

  loadCustomer() {
    this.customerService.getById(3)
      .subscribe(c => console.log('loaded customer: ', c));
  }

  updateCustomer() {
    let c: Customer;
    this.customerService.getById(1)
      .subscribe(cust => {
        c = cust;
        console.log('c to update: ', c);
        c.lastName = 'Winston';
        this.customerService.update(c)
          .subscribe(cust => console.log('updated customer: ', cust));
      });
  }

  deleteCustomer(query: any) {

    this.customerService.deleteEntity(query);
  }

  insertCustomer() {
    let c: Customer = new Customer();
    c.id = 5;
    c.firstName = 'King';
    c.lastName = 'Wilder';
    c.address = 'Golf Center Dr.';

    this.customerService.insert(c);
  }
}
