import {
  Controller,
  Get,
  Post,
  Param,
  Body,
} from '@nestjs/common';
import { GroupSessionsService } from './group-sessions.service';
import { JoinGroupSessionDto } from './group-sessions.dto';

@Controller('group-sessions')
export class GroupSessionsController {
  constructor(private readonly groupSessionsService: GroupSessionsService) {}

  @Get('courses/:courseId')
  async getGroupSessionsByCourse(@Param('courseId') courseId: string) {
    return this.groupSessionsService.getGroupSessionsByCourse(courseId);
  }

  @Post(':bookingId/join')
  async joinGroupSession(
    @Param('bookingId') bookingId: string,
    @Body() dto: JoinGroupSessionDto,
  ) {
    return this.groupSessionsService.joinGroupSession(bookingId, dto);
  }
}
