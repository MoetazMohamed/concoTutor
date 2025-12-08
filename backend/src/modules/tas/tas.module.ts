import { Module } from '@nestjs/common';
import { TAsService } from './tas.service';
import { TAsController } from './tas.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TAsController],
  providers: [TAsService],
  exports: [TAsService],
})
export class TAsModule {}
