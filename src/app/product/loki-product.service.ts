import { Injectable } from '@angular/core';
import { LokiServiceBase } from '../loki/loki.service';
import { Product } from './product';
import { config } from '../shared/shared.config';

@Injectable({
  providedIn: 'root'
})
export class LokiProductService extends LokiServiceBase<Product> {

  constructor() {
    super(config.dbName, config.entities.products);
   }
}
