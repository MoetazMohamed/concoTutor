import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ProductsModule } from './modules/products/products.module';
import { BundlesModule } from './modules/bundles/bundles.module';
import { GroupSessionsModule } from './modules/group-sessions/group-sessions.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { AuthModule } from './modules/auth/auth.module';
import { StudentsModule } from './modules/students/students.module';
import { TAsModule } from './modules/tas/tas.module';
import { AvailabilityModule } from './modules/availability/availability.module';

@Module({
  imports: [
    PrismaModule,
    CoursesModule,
    ProductsModule,
    BundlesModule,
    GroupSessionsModule,
    BookingsModule,
    AuthModule,
    StudentsModule,
    TAsModule,
    AvailabilityModule,
  ],
})
export class AppModule {}
