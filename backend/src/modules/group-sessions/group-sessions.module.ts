import { Module } from '@nestjs/common';
import { GroupSessionsService } from './group-sessions.service';
import { GroupSessionsController } from './group-sessions.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [GroupSessionsService],
  controllers: [GroupSessionsController],
  exports: [GroupSessionsService],
})
export class GroupSessionsModule {}
