import { ApiProperty } from '@nestjs/swagger';
import { RewardRequestStatus } from 'src/common/enums/reward-request-status.enum';
import { RewardItem } from 'src/common/enums/rewardItem.enum';

export class RewardHistoryItemDto {
    @ApiProperty({ example: 'req_00001', description: '보상 요청 ID' })
    requestId: string;

    @ApiProperty({ example: 'usr_00001', description: '유저 코드' })
    userCode: string;

    @ApiProperty({ example: '친구 초대 이벤트', description: '이벤트 제목' })
    eventTitle: string;

    @ApiProperty({ example: RewardItem.COUPON, enum: RewardItem, description: '보상 타입' })
    rewardType: RewardItem;

    @ApiProperty({ example: '5000원 할인 쿠폰', description: '보상 값' })
    rewardValue: string;

    @ApiProperty({ example: RewardRequestStatus.REWARDED, enum: RewardRequestStatus, description: '요청 상태' })
    status: RewardRequestStatus;

    @ApiProperty({ example: '2025-05-12T13:45:00.000Z', description: '지급 시각' })
    rewardedAt: Date;
}
