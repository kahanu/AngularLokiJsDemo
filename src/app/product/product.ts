import { Entity } from '../shared/models';

export class Product extends Entity {
  name: string;
  sku: string;
  price: number;
}
