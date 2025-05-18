import { ApiProperty } from '@nestjs/swagger';
import { RewardHistoryItemDto } from './reward-history-item.dto';

export class GetRewardsHistoryResponseDto {
    @ApiProperty({ example: 2, description: '전체 건수' })
    total: number;

    @ApiProperty({
        type: [RewardHistoryItemDto],
        description: '지급 내역 리스트',
    })
    history: RewardHistoryItemDto[];
}
