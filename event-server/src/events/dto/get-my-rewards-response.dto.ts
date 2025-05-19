import { ApiProperty } from '@nestjs/swagger';
import { RewardSummaryDto } from './reward-summary.dto';

export class GetMyRewardsResponseDto {
    @ApiProperty({ example: 'user_00001', description: '본인 유저 코드' })
    userCode: string;

    @ApiProperty({
        type: [RewardSummaryDto],
        description: '본인이 요청한 보상 내역 목록',
    })
    rewards: RewardSummaryDto[];
}
