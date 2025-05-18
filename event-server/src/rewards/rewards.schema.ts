import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { RewardItem } from 'src/common/enums/rewardItem.enum';


export type RewardDocument = Reward & Document;

@Schema({ timestamps: true })
export class Reward {
    @ApiProperty({ example: 'POINT', enum: RewardItem, description: '보상' })
    @Prop({ required: true, enum: RewardItem, default: RewardItem.POINT })
    type: RewardItem;

    @ApiProperty({ example: 1000, description: '보상 값 (예: 포인트 수, 쿠폰 코드 등)' })
    @Prop({ required: true })
    value: string | number;

    @ApiProperty({ example: 1, description: '지급 수량' })
    @Prop({ required: true })
    amount: number;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
