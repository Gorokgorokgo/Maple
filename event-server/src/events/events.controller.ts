import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event-dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('events')
@ApiBearerAuth('access-token')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: '이벤트 생성' })
  async createEvent(@Body() createEventDto: CreateEventDto) {
    return await this.eventsService.createEvent(createEventDto);
    
  }


/* 
      eventId: event._id,
      message: '이벤트가 성공적으로 생성되었습니다.',
      createdAt: event.createdAt,
    }; */


}
