import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Role } from 'src/common/enums/role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {

  @ApiProperty({ example: 'mapler77', description: '로그인 ID' })
  @Prop({ required: true, unique: true })
  loginId: string;

  @ApiProperty({ example: 'qweQWE123!@#', description: '비밀번호' })
  @Prop({ required: true })
  password: string;

  @ApiProperty({ example: 'zi존법사', description: '닉네임' })
  @Prop({ required: true })
  nickname: string;

  @ApiProperty({ example: 'USER', enum: Role, description: '권한' })
  @Prop({ required: true, enum: Role, default: Role.USER })
  role: Role;

  @ApiProperty({ example: 'USER_00001', description: '유저 코드' })
  @Prop({ required: true, unique: true })
  userCode: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
