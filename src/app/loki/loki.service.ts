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
    @Inject('collName') protected collName: string
  ) {
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
      this.db.saveDatabase();
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
    const data1 = Object.assign({}, data); // Hack to work with LokiJs.

    const coll = this.db.getCollection(this.collName);

    const found = coll.findOne({ id: data1.id });
    const found1 = Object.assign(found, data1);

    coll.update(found1);

    this.db.saveDatabase(this.collName);
    return of(found1);
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
    // console.log('data: ', data);
    const data1 = Object.assign({}, data);
    const coll = this.db.getCollection(this.collName);
    coll.insert(data1);
    this.db.saveDatabase(this.collName);
    return of(data);
  }
}
