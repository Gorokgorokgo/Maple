import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Reward, RewardSchema } from './reward.schema';

export type RewardDefinitionDocument = RewardDefinition & Document;

@Schema({ timestamps: true })
export class RewardDefinition {
  @Prop({ required: true })
  eventCode: string;

  @Prop({
    type: [RewardSchema],
    required: true,
    default: [],
  })
  rewards: Reward[];

  @ApiProperty({ example: '2025-05-18T14:30:00.000Z', description: '(UTC 기준이며, 한국시간보다 9시간 이후 시각입니다.)' })
  createdAt: Date;
}

export const RewardDefinitionSchema =
  SchemaFactory.createForClass(RewardDefinition);
