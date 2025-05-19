import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EnhancementDocument = Enhancement & Document;

@Schema({ timestamps: true })
export class Enhancement {
  @Prop({ required: true })
  userCode: string;

  @Prop({ required: true })
  eventCode: string;

  @Prop({ required: true, default: 0 })
  successCount: number;
}

export const EnhancementSchema =
  SchemaFactory.createForClass(Enhancement);
