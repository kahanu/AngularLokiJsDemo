import { Injectable } from '@angular/core';
import { LokiService } from '../../loki/loki.service';
import { Customer } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class LokiCustomerService {
  private CUSTOMERS = 'customers';
  private dbName = 'mydb.json';

  constructor(private loki: LokiService) {
    let db = loki.init(this.dbName, this.CUSTOMERS);
    if (db.getCollection(this.CUSTOMERS) === null) {
      let customers = db.addCollection(this.CUSTOMERS);
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

    db.saveDatabase(this.dbName);
  }

  getAll() {
    return this.loki.getAll();
  }

  getById(id: number) {
    return this.loki.getById(id);
  }

  update(customer: Customer) {
    this.loki.update(customer);
  }

  delete(id: number) {
    this.loki.delete(id);
  }
}
