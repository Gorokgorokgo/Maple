import { ApiProperty } from '@nestjs/swagger';

export class EnhancementResponseDto {
  @ApiProperty({ example: true, description: '강화 성공 여부 (10% 확률)' })
  success: boolean;

  @ApiProperty({ example: 1, description: '해당 이벤트(강화)에서 누적된 성공 횟수' })
  successCount: number;
}
