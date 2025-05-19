import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { RewardItem } from 'src/common/enums/rewardItem.enum';


export type RewardDocument = Reward & Document;

@Schema({ _id: false, timestamps: true })
export class Reward {
    @ApiProperty({ example: 'POINT', enum: RewardItem, description: '보상' })
    @Prop({ required: true, enum: RewardItem, default: RewardItem.POINT })
    type: RewardItem;

    @Prop({ required: true, type: SchemaTypes.Mixed })
    value: string | number;

    @ApiProperty({ example: 1, description: '지급 수량' })
    @Prop({ required: true })
    amount: number;

    @ApiProperty({ example: '2025-05-18T14:30:00.000Z', description: '(UTC 기준이며, 한국시간보다 9시간 이후 시각입니다.)' })
    createdAt: Date;

    @ApiProperty({ example: '2025-05-18T14:30:00.000Z', description: '(UTC 기준이며, 한국시간보다 9시간 이후 시각입니다.)' })
    updatedAt: Date;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
