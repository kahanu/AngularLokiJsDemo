import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../shared/models';
import { CustomerService } from '../core/services/customer.service';
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
    this.updateCustomer();
    this.loadCustomer();
    this.deleteCustomer();
    this.loadCustomers();
  }

  loadCustomers() {
    this.customers$ = this.customerService.getAll()
      .pipe(
        tap(r => console.log('r: ', r.data)),
        map(response => response.data as Customer[]));
  }

  loadCustomer() {
    this.customerService.getById(3)
      .subscribe(c => console.log('c: ', c[0]));
  }

  updateCustomer() {
    let c: Customer;
    this.customerService.getById(1)
      .subscribe(cust => {
        c = cust[0];
        console.log('c to update: ', c);
        c.lastName = 'Doe';
        this.customerService.update(c);
      });
  }

  deleteCustomer() {
    this.customerService.delete(4);
  }
}
