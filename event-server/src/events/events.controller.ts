import {
  Body,
  Controller,
  Param,
  Post,
  Req
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateEventRequestDto } from './dto/create-event-request.dto';
import { CreateEventResponseDto } from './dto/create-event-response-dto';
import { CreateRewardRequestResponseDto } from './dto/create-reward-request-response.dto';
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

  @Post(':eventCode/rewards/request')
  @ApiOperation({ summary: '이벤트 보상 요청' })
  @ApiResponse({
    status: 201, description: '보상 요청 성공',
    type: CreateRewardRequestResponseDto
  })
  @ApiResponse({ status: 404, description: '이벤트 없음' })
  @ApiResponse({ status: 409, description: '이미 요청됨' })
  async requestReward(
    @Param('eventCode') eventCode: string,
    @Req() req: Request,               
  ): Promise<CreateRewardRequestResponseDto> {
    
    const userCode = (req.headers['userCode'] ?? req.headers['usercode']) as string;

    return this.eventsService.createRewardRequest(userCode, eventCode);
  }
}
