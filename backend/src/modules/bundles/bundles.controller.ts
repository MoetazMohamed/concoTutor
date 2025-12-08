import {
  Controller,
  Get,
  Post,
  Param,
  Body,
} from '@nestjs/common';
import { BundlesService } from './bundles.service';
import { CreateBundlePurchaseDto } from './bundles.dto';

@Controller('bundles')
export class BundlesController {
  constructor(private readonly bundlesService: BundlesService) {}

  @Get('students/:studentId')
  async getStudentBundles(@Param('studentId') studentId: string) {
    return this.bundlesService.getStudentBundles(studentId);
  }

  @Get('students/:studentId/courses/:courseId/active')
  async getStudentActiveBundles(
    @Param('studentId') studentId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.bundlesService.getStudentActiveBundles(studentId, courseId);
  }

  @Post('courses/:courseId/purchase')
  async purchaseBundle(
    @Param('courseId') courseId: string,
    @Body() dto: CreateBundlePurchaseDto,
  ) {
    // Ensure courseId from body matches route param
    dto.courseId = courseId;
    return this.bundlesService.purchaseBundle(dto);
  }
}
