import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { RewardRequestStatus } from 'src/common/enums/reward-request-status.enum';


export type RewardRequestDocument = RewardRequest & Document;

@Schema({ timestamps: true })
export class RewardRequest {

    @ApiProperty({ example: 'user_00001', description: '유저 코드' })
    @Prop({ required: true })
    userCode: string;

    @ApiProperty({ example: 'evt_00001', description: '이벤트 코드' })
    @Prop({ required: true })
    eventCode: string;

    @ApiProperty({ example: 'PENDING', enum: RewardRequestStatus, description: '보상 진행 상태' })
    @Prop({ enum: RewardRequestStatus, default: RewardRequestStatus.PENDING })
    status: RewardRequestStatus;

    @ApiProperty({ example: '2025-05-18T14:30:00.000Z', description: '(UTC 기준이며, 한국시간보다 9시간 이후 시각입니다.)' })
    @Prop()
    requestedAt: Date;
    @ApiProperty({ example: '2025-05-18T14:30:00.000Z', description: '(UTC 기준이며, 한국시간보다 9시간 이후 시각입니다.)' })
    @Prop()
    rewardedAt?: Date;
}

export const RewardRequestSchema =
    SchemaFactory.createForClass(RewardRequest);
