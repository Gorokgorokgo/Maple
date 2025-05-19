import { ApiProperty } from '@nestjs/swagger';

export class CreateRewardResponseDto {
  @ApiProperty({ example: 'evt_00001', description: '연결된 이벤트 코드' })
  eventId: string;

  @ApiProperty({ example: '보상이 등록되었습니다.' })
  message: string;

  @ApiProperty({ example: 2, description: '등록된 보상 항목 수' })
  rewardCount: number;

  @ApiProperty({ example: '2025-05-18T16:30:00.000Z', description: '등록 시간 (UTC 기준이며, 한국시간보다 9시간 이후 시각입니다.)' })
  definedAt: Date;
}