import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('courses/:courseId/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProductsByCourse(@Param('courseId') courseId: string) {
    return this.productsService.getProductsByCourse(courseId);
  }
}
