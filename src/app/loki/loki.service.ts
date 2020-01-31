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

    found = {...found, ...data};
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
