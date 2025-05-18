import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRewardRequestDto } from './dto/create-reward-request.dto';
import { CreateRewardResponseDto } from './dto/create-reward-response.dto';
import { RewardsService } from './rewards.service';
import { RewardRequestStatus } from 'src/common/enums/reward-request-status.enum';
import { GetRewardsHistoryResponseDto } from './dto/get-rewards-history-response.dto';

@ApiTags('rewards')
@ApiBearerAuth('access-token')
@Controller('rewards')
export class RewardsController {
    constructor(private readonly rewardsService: RewardsService) { }

    @Post('define')
    @ApiOperation({ summary: '보상 등록 (운영자 / 관리자)' })
    @ApiResponse({ status: 201, type: CreateRewardResponseDto })
    async createReward(@Body() createRewardDto: CreateRewardRequestDto): Promise<CreateRewardResponseDto> {
        return await this.rewardsService.createReward(createRewardDto);
    }

    @Get('history')
    @ApiOperation({ summary: '지급 내역 조회 (감사자 / 관리자)' })
    @ApiQuery({ name: 'userCode', required: false, description: '유저 코드별 필터링 ex) user_00001' })
    @ApiQuery({ name: 'eventCode', required: false, description: '이벤트 코드별 필터링 ex) event_00001' })
    @ApiQuery({
        name: 'status',
        enum: RewardRequestStatus,
        required: false,
        description: '요청 상태별 필터링',
    })
    @ApiResponse({ status: 200, type: GetRewardsHistoryResponseDto })
    getHistory(
        @Query('userCode') userCode?: string,
        @Query('eventCode') eventCode?: string,
        @Query('status') status?: RewardRequestStatus,
    ): Promise<GetRewardsHistoryResponseDto> {
        return this.rewardsService.getHistory({ userCode, eventCode, status });
    }


}