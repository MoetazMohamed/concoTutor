import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ProductDto } from './products.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getProductsByCourse(courseId: string): Promise<ProductDto[]> {
    // Verify course exists
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const products = await this.prisma.product.findMany({
      where: { courseId, isActive: true },
      orderBy: { productType: 'asc' },
    });

    return products.map((p) => ({
      ...p,
      basePrice: typeof p.basePrice === 'number' ? p.basePrice : parseFloat(p.basePrice.toString()),
    }));
  }

  async getProductById(id: string): Promise<ProductDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return {
      ...product,
      basePrice: typeof product.basePrice === 'number' ? product.basePrice : parseFloat(product.basePrice.toString()),
    };
  }
}
