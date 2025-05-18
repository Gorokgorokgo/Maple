import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRewardRequestDto } from './dto/create-reward-request.dto';
import { CreateRewardResponseDto } from './dto/create-reward-response.dto';
import { RewardsService } from './rewards.service';

@ApiTags('rewards')
@ApiBearerAuth('access-token')
@Controller('rewards')
export class RewardsController {
    constructor(private readonly rewardsService: RewardsService) { }

    @Post('define')
    @ApiOperation({ summary: '보상 등록' })
    @ApiResponse({ status: 201, type: CreateRewardResponseDto })
    async createReward(@Body() createRewardDto: CreateRewardRequestDto): Promise<CreateRewardResponseDto> {
        return await this.rewardsService.createReward(createRewardDto);
    }




}