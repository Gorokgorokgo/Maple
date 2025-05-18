import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateEventRequestDto } from './dto/create-event-request.dto';
import { CreateEventResponseDto } from './dto/create-event-response-dto';
import { EventsService } from './events.service';

@ApiTags('events')
@ApiBearerAuth('access-token')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  @Post()
  @ApiOperation({ summary: '이벤트 생성' })
  @ApiResponse({ status: 201, type: CreateEventResponseDto })
  async createEvent(@Body() createEventDto: CreateEventRequestDto): Promise<CreateEventResponseDto> {
    return await this.eventsService.createEvent(createEventDto);
  }




}
