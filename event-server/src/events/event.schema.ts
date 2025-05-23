import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { EventStatus } from 'src/common/enums/event-status.enum';


export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
    @Prop({ required: true, unique: true })
    eventCode: string;

    @ApiProperty({ example: '출석 이벤트', description: '이벤트 제목' })
    @Prop({ required: true })
    title: string;

    @ApiProperty({ example: '3일 연속 로그인 시 보상 지급', description: '이벤트 설명' })
    @Prop()
    description: string;

    @ApiProperty({ example: ['LOGIN_3DAYS'], description: '이벤트 조건 목록' })
    @Prop({ type: [String], default: [] })
    conditions: string[];

    @ApiProperty({ example: '2025-05-01T00:00:00.000Z', description: '이벤트 시작일 (UTC 기준이며, 한국시간보다 9시간 이후 시각입니다.)' })
    @Prop({ required: true })
    startDate: Date;

    @ApiProperty({ example: '2025-05-31T23:59:59.000Z', description: '이벤트 종료일 (UTC 기준이며, 한국시간보다 9시간 이후 시각입니다.)' })
    @Prop({ required: true })
    endDate: Date;

    @ApiProperty({ example: 'ACTIVE', enum: EventStatus, description: '이벤트 상태' })
    @Prop({ required: true, enum: EventStatus, default: EventStatus.ACTIVE })
    status: EventStatus;

    @ApiProperty({ example: '2025-05-18T14:30:00.000Z', description: '(UTC 기준이며, 한국시간보다 9시간 이후 시각입니다.)' })
    createdAt: Date;

    @ApiProperty({ example: '2025-05-18T14:30:00.000Z', description: '(UTC 기준이며, 한국시간보다 9시간 이후 시각입니다.)' })
    updatedAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
