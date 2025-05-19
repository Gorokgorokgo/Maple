import { ApiProperty } from '@nestjs/swagger';
import { RewardRequestStatus } from 'src/common/enums/reward-request-status.enum';

export class RewardSummaryDto {
    @ApiProperty({ example: 'evt_00001', description: '이벤트 코드' })
    eventCode: string;

    @ApiProperty({ example: '무기_강화_이벤트', description: '이벤트 제목' })
    eventTitle: string;

    @ApiProperty({
        example: '2025-05-12T13:45:00.000Z',
        description: '요청 시각 (UTC 기준이며, 한국시간보다 9시간 이후 시각입니다.)'
    })
    requestedAt: Date;

    @ApiProperty({
        example: RewardRequestStatus.PENDING,
        enum: RewardRequestStatus,
        description: '요청 상태',
    })
    status: RewardRequestStatus;
}
