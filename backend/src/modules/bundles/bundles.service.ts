import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  CreateBundlePurchaseDto,
  BundlePurchaseDto,
} from './bundles.dto';

@Injectable()
export class BundlesService {
  constructor(private prisma: PrismaService) {}

  async getStudentActiveBundles(
    studentId: string,
    courseId: string,
  ): Promise<BundlePurchaseDto[]> {
    const now = new Date();

    const bundles = await this.prisma.bundlePurchase.findMany({
      where: {
        studentId,
        courseId,
        validFrom: { lte: now },
        validTo: { gte: now },
      },
      include: { product: true },
      orderBy: { validTo: 'desc' },
    });

    return bundles;
  }

  async getStudentBundles(studentId: string): Promise<BundlePurchaseDto[]> {
    const bundles = await this.prisma.bundlePurchase.findMany({
      where: { studentId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    return bundles;
  }

  async purchaseBundle(
    dto: CreateBundlePurchaseDto,
  ): Promise<BundlePurchaseDto> {
    // Verify student exists
    const student = await this.prisma.student.findUnique({
      where: { id: dto.studentId },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${dto.studentId} not found`);
    }

    // Verify course exists
    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${dto.courseId} not found`);
    }

    // Verify product exists and is for this course
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product || product.courseId !== dto.courseId) {
      throw new NotFoundException(
        `Product with ID ${dto.productId} not found for this course`,
      );
    }

    // Check for duplicate purchase (same student, course, product)
    const existing = await this.prisma.bundlePurchase.findUnique({
      where: {
        studentId_courseId_productId: {
          studentId: dto.studentId,
          courseId: dto.courseId,
          productId: dto.productId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException(
        'This student already has this bundle product',
      );
    }

    // Create bundle purchase
    const bundlePurchase = await this.prisma.bundlePurchase.create({
      data: {
        studentId: dto.studentId,
        courseId: dto.courseId,
        productId: dto.productId,
        coverageType: dto.coverageType,
        totalSessions: dto.totalSessions,
        remainingSessions: dto.totalSessions,
        validFrom: new Date(dto.validFrom),
        validTo: new Date(dto.validTo),
      },
    });

    return bundlePurchase;
  }
}
