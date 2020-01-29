# Angular LokiJs Demo

This is an Angular 8 application that implements LokiJs as an in-memory-database. [Click here](https://github.com/techfort/LokiJS) to find out more about LokiJs a JavaScript NoSql database option.

## What is this?

LokiJs can give your application full CRUD capabilities without hitting a web api endpoint or any live backend server.  All the data is stored by default in the browser's local storage.  There are other options (Adapters) that allow you to use other storage means.

## Recommendations

For web development, this is NOT recommended for large public-facing production applications.  I use it only when I'm in development and for demo purposes to clients.  This way I can practice code-first development without having to spin up a relational database with tables, etc.  I just need to create Angular models in the shape that I need, and I can easily modify them before creating a full development database schema.  Or it can easily be used for a production NoSql implementation such as with MongoDB.

This is a good alternative for the "angular-in-memory-web-api" package, as this package will not work if your application currently uses live WebApi services.  LokiJs will work along side live WebApi services without issues.

For mobile development, it is supposed to be a good alternative based on your needs.  I have not used it in a mobile app yet.

## Note

In this application, I've installed the ```LokiJs``` npm package in the devDependencies collection.  Since I'm only going to use it for development, I don't want it being part of the bundles for production since it will never be used this way.  But for mobile development, it will probably go into the standard dependencies collection.

## Run It

After you download it, install the npm packages.  In the folder with the starter kit, open the terminal and enter:

```javascript
npm install
```

Once all the packages have been installed, you can run it.

```javascript
npm start
```

## Local Loki Module

I've created the local LokiModule and service in the ```/loki``` folder.  It just contains the ```LokiModule``` and an abstract base class, ```LokiServiceBase```.

## Usage

The ```LokiServiceBase``` looks like this, it doesn't have to change for normal operations:

```typescript
import { Injectable, Inject } from '@angular/core';
import * as Loki from 'lokijs';
import { of, Observable } from 'rxjs';
import { Entity } from '../shared/models/base';

@Injectable({
  providedIn: 'root'
})
export abstract class LokiServiceBase<T extends Entity | any> {
  protected db: any;

  constructor(
    @Inject('dbName') protected dbName: string, 
    @Inject('collName') protected collName: string) {

      this.db = new Loki(dbName, {
        autoload: true,
        autosave: true,
        autosaveInterval: 10000
      });
      
      this.databaseInit();
  }

  private databaseInit() {
    this.db.loadDatabase();
    if (!this.db.getCollection(this.collName)) {
      this.db.addCollection(this.collName);
    }
  }

  getAll(): Observable<T[]> {
    return of(this.db.getCollection(this.collName).data);
  }

  getById(id: number): Observable<T> {
    const coll = this.db.getCollection(this.collName);
    return of(coll.findOne({ id: id }));
  }

  update(data: any): Observable<T> {
    const coll = this.db.getCollection(this.collName);

    let found = coll.findOne({ id: data.id });
    found = {...found, data};
    coll.update(found);

    this.db.saveDatabase(this.collName);
    return of(found);
  }

  delete(id: number): Observable<void> {
    const coll = this.db.getCollection(this.collName);
    coll.findAndRemove({ id: id });
    this.db.saveDatabase(this.collName);
    return of();
  }

  deleteEntity(query: any): Observable<void> {
    const coll = this.db.getCollection(this.collName);
    coll.findAndRemove(query);
    this.db.saveDatabase(this.collName);
    return of();
  }

  insert(data: T): Observable<T> {
    const coll = this.db.getCollection(this.collName);
    coll.insert(data);
    this.db.saveDatabase(this.collName);
    return of(data);
  }
}

```

To use the ```LokiServiceBase```, you create a new service class that will extend the ```LokiServiceBase``` class.  This class will handle the CRUD operations for a single entity in your application, such as ```Customers```.

```javascript
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

```

The base class is generic so it takes a parameter of the entity (Customer, Product, Order, etc) or ```any```.  A strongly-typed class is recommended.

At this point you can inject this service into your components in the normal manner.

```javascript
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
    // These are used here just for demo purposes.

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
    c.firstName = 'Harry';
    c.lastName = 'Potter';
    c.address = 'Wizardry Dr.';

    this.customerService.insert(c);
  }
}

```

A normal HTML table would look something like this.  Nothing new here, just standard stuff.

```html
<h2>Customers</h2>
<p>The customers are loaded from an Http service call.</p>

<table class="table">
  <thead>
    <tr>
      <th>Id</th>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Address</th>
    </tr>
  </thead>
  <tbody>
    <tr ngFor="let customer of customers$ | async">
      <td>{{ customer.id }}</td>
      <td>{{ customer.firstName }}</td>
      <td>{{ customer.lastName }}</td>
      <td>{{ customer.address }}</td>
    </tr>
  </tbody>
</table>
```

## Troubleshooting
### Module not found: Error: Can't resolve 'fs'

This seems to be an issue with Angular and npm packages that use ```fs```, which is a node based file-system package.  You may get an error in the console when you start up the project like this:

```
WARNING in ./node_modules/lokijs/src/lokijs.js
Module not found: Error: Can't resolve 'fs' in 'C:\Users\blah\source\repos\myapp\node_modules\lokijs\src'
```

For this demo app, I've found that this warning can be fixed by adding the following to the end of your package.json, right after the devDependencies element.

```json
  "browser": {
    "fs": false
  }
```

This is all that was needed for the demo app to work, but I've needed other properties included for other apps to work, and even then, this doesn't completely eliminate the warning.

```json
    "browser": {
        "crypto": false,
        "fs": false,
        "path": false,
        "os": false,
        "net": false,
        "stream": false,
        "tls": false
    }
```

There are other suggestions that your Angular app contains the following in the root tsconfig.json file:

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "downlevelIteration": true,
    "outDir": "./dist/out-tsc",
    "sourceMap": true,
    "declaration": false,
    "module": "esnext",
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "target": "es2015",
    "typeRoots": [
      "node_modules/@types"  <--- include this if not already there
    ],
    "lib": [
      "es2018",
      "dom"
    ]
  }
}
```

Another suggestion was to include the ```@types/node``` package to the devDependencies.

If all this doesn't remove the warning, the project should still work since it is after all just a warning and not an error that won't let Angular compile.


I hope this helps.  Enjoy.
