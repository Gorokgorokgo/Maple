// src/events/dto/create-reward-request-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { RewardRequestStatus } from 'src/common/enums/reward-request-status.enum';


export class CreateRewardRequestResponseDto {
  @ApiProperty({ example: 'evt_00003' })
  eventCode: string;

  @ApiProperty({ example: 'req_00001', required: false })
  requestId?: string | null;

  @ApiProperty({ example: '아직 요청 기록이 없습니다.', required: true })
  message: string;

  @ApiProperty({ enum: RewardRequestStatus })
  status: RewardRequestStatus;

  @ApiProperty({ example: '2025-06-01T00:00:00.000Z', description: '(UTC 기준이며, 한국시간보다 9시간 이후 시각입니다.)', required: false })
  requestedAt?: Date | null;

  @ApiProperty({ example: '2025-06-02T12:00:00.000Z', description: '(UTC 기준이며, 한국시간보다 9시간 이후 시각입니다.)', required: false })
  rewardedAt?: Date | null;
}
