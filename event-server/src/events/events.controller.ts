import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateEventRequestDto } from './dto/create-event-request.dto';
import { CreateEventResponseDto } from './dto/create-event-response.dto';
import { CreateRewardRequestResponseDto } from './dto/create-reward-request-response.dto';
import { EventsService } from './events.service';
import { GetMyRewardsResponseDto } from './dto/get-my-rewards-response.dto';

@ApiTags('events')
@ApiBearerAuth('access-token')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  @Get('me/rewards')
  @ApiOperation({ summary: '본인 보상 요청 이력 조회' })
  @ApiResponse({
    status: 200,
    description: '본인이 요청한 보상 목록',
    type: GetMyRewardsResponseDto,
  })
  getMyRewards(
    @Req() req: Request,
  ): Promise<GetMyRewardsResponseDto> {
    const userCode = (req.headers['userCode'] ?? req.headers['usercode']) as string;

    return this.eventsService.getMyRewards(userCode);
  }

  @Post()
  @ApiOperation({ summary: '이벤트 생성 (운영자 / 관리자)' })
  @ApiResponse({ status: 201, type: CreateEventResponseDto })
  async createEvent(@Body() createEventDto: CreateEventRequestDto): Promise<CreateEventResponseDto> {
    return await this.eventsService.createEvent(createEventDto);
  }

  @Post(':eventCode/rewards/request')
  @ApiOperation({ summary: '이벤트 보상 요청 (유저 / 관리자)' })
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
