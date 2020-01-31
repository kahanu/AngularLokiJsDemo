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

  getById(id: number | string): Observable<T> {
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

  delete(id: number | string): Observable<any> {
    const coll = this.db.getCollection(this.collName);
    coll.findAndRemove({ id: id });
    this.db.saveDatabase(this.collName);
    return of({});
  }

  deleteEntity(query: any): Observable<any> {
    const coll = this.db.getCollection(this.collName);
    coll.findAndRemove(query);
    this.db.saveDatabase(this.collName);
    return of({});
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
import uuid from 'uuid';

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

```

The base class is generic so it takes a parameter of the entity (Customer, Product, Order, etc) or ```any```.  A strongly-typed class is recommended.

At this point you can inject this service into your components in the normal manner.

```javascript
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

```

A normal HTML table would look something like this.  Nothing new here, just standard stuff.

```html
<h2>Customers</h2>
<p>The customers are loaded from an LokiJs in-memory database.  This is a full CRUD demo.</p>

<div class="container-fluid">
  <div class="row">
    <div class="col-xl-3">
      <button class="btn btn-info" (click)="addNew()">Add New</button>
      <select size="4" class="form-control">
        <option
          [value]="customer.id"
          *ngFor="let customer of customers$ | async"
          (click)="selectedCustomer($event)"
          >{{ customer.firstName }} {{ customer.lastName }}</option
        >
      </select>
    </div>
    <div class="col-xl-9" *ngIf="selected">
      <form [formGroup]="form">
        <div class="form-group row">
          <label for="firstName" class="col-sm-2">First Name:</label>
          <div class="col-sm-10">
            <input
              type="text"
              formControlName="firstName"
              class="form-control"
            />
          </div>
        </div>
        <div class="form-group row">
          <label for="lastName" class="col-sm-2">Last Name:</label>
          <div class="col-sm-10">
            <input
              type="text"
              formControlName="lastName"
              class="form-control"
            />
          </div>
        </div>
        <div class="form-group row">
          <label for="address" class="col-sm-2">Address:</label>
          <div class="col-sm-10">
            <input type="text" formControlName="address" class="form-control" />
          </div>
        </div>
        <div class="form-group row">
          <div class="col-sm-12">
            <button type="button" class="btn btn-primary" (click)="save()">Save</button>
            <button type="button" class="btn btn-light" (click)="delete()">Delete</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
```

## Troubleshooting
### Module not found: Error: Can't resolve 'fs'

This seems to be an issue with Angular and npm packages that use ```fs```, which is a node based file-system package.  You may get a warning in the console when you start up the project like this:

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
