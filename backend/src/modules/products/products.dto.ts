import { ProductType } from '@prisma/client';

export class ProductDto {
  id!: string;
  courseId!: string;
  name!: string;
  productType!: ProductType;
  description!: string | null;
  basePrice!: number;
  isActive!: boolean;
}
