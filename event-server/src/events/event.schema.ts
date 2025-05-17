import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type EventDocument = Event & Document;

export enum EventStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    ENDED = 'ENDED',
}

@Schema({ timestamps: true })
export class Event {

    @ApiProperty({ example: '출석 이벤트', description: '이벤트 제목' })
    @Prop({ required: true })
    title: string;

    @ApiProperty({ example: '3일 연속 로그인 시 보상 지급', description: '이벤트 설명' })
    @Prop()
    description: string;

    @ApiProperty({ example: ['LOGIN_3DAYS'], description: '이벤트 조건 목록' })
    @Prop({ type: [String], default: [] })
    conditions: string[];

    @ApiProperty({ example: '2025-05-01T00:00:00.000Z', description: '이벤트 시작일' })
    @Prop({ required: true })
    startDate: Date;

    @ApiProperty({ example: '2025-05-31T23:59:59.000Z', description: '이벤트 종료일' })
    @Prop({ required: true })
    endDate: Date;

    @ApiProperty({ example: 'ACTIVE', enum: EventStatus, description: '이벤트 상태' })
    @Prop({ required: true, enum: EventStatus, default: EventStatus.ACTIVE })
    status: EventStatus;
}

export const EventSchema = SchemaFactory.createForClass(Event);
