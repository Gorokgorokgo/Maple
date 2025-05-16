import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  loginId: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  nickname: string;

  @Prop({ required: true, enum: ['USER', 'ADMIN', 'OPERATOR', 'AUDITOR'], default: 'USER' })
  role: string;

  @Prop({ required: true, unique: true })
  userCode: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
