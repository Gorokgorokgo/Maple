// src/events/dto/create-reward-request-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { RewardRequestStatus } from 'src/common/enums/reward-request-status.enum';


export class CreateRewardRequestResponseDto {
    @ApiProperty({ example: 'evt_00003', description: '이벤트 코드' })
    eventCode: string;

    @ApiProperty({ example: '64a1f3e0d5b7a9c123456789', description: '요청 ID' })
    requestId: string;

    @ApiProperty({ example: '이벤트가 성공적으로 생성되었습니다.' })
    message: string;

    @ApiProperty({ enum: RewardRequestStatus, description: '요청 상태' })
    status: RewardRequestStatus;

    @ApiProperty({ example: '2025-05-18T18:00:00.000Z', description: '요청 시각' })
    requestedAt: Date;
}
