import { Injectable } from '@angular/core';
import { LokiServiceBase } from '../../loki/loki.service';
import { Customer } from '../../shared/models';
import { config } from '../../shared/shared.config';
import uuid from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class LokiCustomerService extends LokiServiceBase<Customer> {

  constructor() {
    super(config.dbName, config.entities.customers);

    const customers = this.db.getCollection(config.entities.customers);

    if (customers.data.length === 0) {
      // Seed only if needed.
      customers.insert([
        {
          id: uuid(),
          firstName: 'John',
          lastName: 'Doh',
          address: '123 Main St.'
        },
        {
          id: uuid(),
          firstName: 'Sue',
          lastName: 'Miller',
          address: '49 E 4th St.'
        },
        {
          id: uuid(),
          firstName: 'Henry',
          lastName: 'Block',
          address: '88992 Cutter Lane'
        },
        {
          id: uuid(),
          firstName: 'Alice',
          lastName: 'Morey',
          address: '182 S Wilson Way'
        }
      ]);
    }
  }
}
