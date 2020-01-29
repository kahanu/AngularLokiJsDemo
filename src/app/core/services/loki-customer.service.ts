import { Injectable } from '@angular/core';
import { LokiServiceBase } from '../../loki/loki.service';
import { Customer } from '../../shared/models';
import { config } from '../../shared/shared.config';

@Injectable({
  providedIn: 'root'
})
export class LokiCustomerService extends LokiServiceBase<Customer> {

  constructor() {
    super(config.dbName, config.entities.customers);
    
    let customers = this.db.getCollection(config.entities.customers);

    if(customers.data.length === 0) {
      // Seed only if needed.
      customers.insert([
        {
          "id": 1,
          "firstName": "John",
          "lastName": "Doh",
          "address": "123 Main St."
        },
        {
          "id": 2,
          "firstName": "Sue",
          "lastName": "Miller",
          "address": "49 E 4th St."
        },
        {
          "id": 3,
          "firstName": "Henry",
          "lastName": "Block",
          "address": "88992 Cutter Lane"
        },
        {
          "id": 4,
          "firstName": "Alice",
          "lastName": "Morey",
          "address": "182 S Wilson Way"
        }
      ]);
    }
  }
}
