import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ProductsModule } from './modules/products/products.module';
import { BundlesModule } from './modules/bundles/bundles.module';
import { GroupSessionsModule } from './modules/group-sessions/group-sessions.module';
import { BookingsModule } from './modules/bookings/bookings.module';

@Module({
  imports: [
    PrismaModule,
    CoursesModule,
    ProductsModule,
    BundlesModule,
    GroupSessionsModule,
    BookingsModule,
  ],
})
export class AppModule {}
