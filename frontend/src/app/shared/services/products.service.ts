import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface Product {
  id: string;
  courseId: string;
  name: string;
  description: string;
  pricePerSession: number;
  type: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private api: ApiService) {}

  getProductsByCourse(courseId: string) {
    return this.api.get<Product[]>(`/courses/${courseId}/products`);
  }
}
