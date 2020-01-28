import { Injectable } from '@angular/core';
import * as Loki from 'lokijs';
import * as LokiLocalStorageAdapter from 'lokijs';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LokiService {
  private db: any;
  private collName: string;

  init(fileName: string, collName: string, opt?: any) {
    this.collName = collName;
    opt = opt || {};
    opt.autoload = true,
    opt.autosave = true,
    opt.adapter = new LokiLocalStorageAdapter(fileName);
    if (this.db === undefined) {
      this.db = new Loki(fileName, opt);
    }
    return this.db;
  }

  getAll(): Observable<any> {
    return of(this.db.getCollection(this.collName));
  }

  getById(id: number): Observable<any> {
    const coll = this.db.getCollection(this.collName);
    return of(coll.find({ id: id }));
  }

  update(data: any): void {
    const coll = this.db.getCollection(this.collName);
    let found = coll.find({ id: data.id });
    found = [...found, data];
    coll.update(found);
  }

  delete(id: number): void {
    const coll = this.db.getCollection(this.collName);
    coll.findAndRemove({ id: id });
  }
}
