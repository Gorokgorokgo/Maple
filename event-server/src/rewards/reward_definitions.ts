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

  @ApiProperty({ example: '2025-05-18T14:30:00.000Z' })
  createdAt: Date;
}

export const RewardDefinitionSchema =
  SchemaFactory.createForClass(RewardDefinition);
