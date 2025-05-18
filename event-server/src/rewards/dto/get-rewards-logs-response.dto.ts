import { ApiProperty } from '@nestjs/swagger';
import { RewardLogDto } from './reward-log.dto';

export class GetRewardsLogsResponseDto {
  @ApiProperty({ example: 2, description: '전체 건수' })
  total: number;

  @ApiProperty({
    type: [RewardLogDto],
    description: '보상 요청 기록 리스트',
  })
  logs: RewardLogDto[];
}
