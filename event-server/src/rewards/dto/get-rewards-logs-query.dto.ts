import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RewardRequestStatus } from 'src/common/enums/reward-request-status.enum';

export class GetRewardsLogsQueryDto {
  @ApiPropertyOptional({ description: '유저 코드', example: 'user_00001' })
  @IsOptional()
  @IsString()
  userCode?: string;

  @ApiPropertyOptional({ description: '이벤트 코드', example: 'evt_00001' })
  @IsOptional()
  @IsString()
  eventCode?: string;

  @ApiPropertyOptional({
    description: '요청 상태',
    enum: RewardRequestStatus,
  })
  @IsOptional()
  @IsEnum(RewardRequestStatus)
  status?: RewardRequestStatus;
}
