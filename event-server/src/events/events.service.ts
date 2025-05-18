import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Counter, CounterDocument } from 'src/common/counter.schema';
import { CreateEventRequestDto } from './dto/create-event-request.dto';
import { CreateEventResponseDto } from './dto/create-event-response-dto';
import { EventDocument } from './event.schema';

@Injectable()
export class EventsService {
    constructor(
        @InjectModel(Event.name) private eventModel: Model<EventDocument>,
        @InjectModel(Counter.name) private counterModel: Model<CounterDocument>,
    ) { }

    // Code +1씩 카운트
    async getNextSequence(name: string): Promise<number> {
        const result = await this.counterModel.findOneAndUpdate(
            { name },
            { $inc: { seq: 1 } },
            { new: true, upsert: true },
        );
        return result.seq;
    }

    // 이벤트 생성
    async createEvent(dto: CreateEventRequestDto): Promise<CreateEventResponseDto> {
        const { title, startDate, endDate, conditions, status } = dto;

        const sequence = await this.getNextSequence('event');
        // evt_00001 형식
        const eventCode = `evt_${String(sequence).padStart(5, '0')}`; 

        const newEvent = new this.eventModel({
            title,
            startDate,
            endDate,
            conditions,
            status,
            eventCode, // 저장
        });

        const event = await newEvent.save();

        return {
            eventId: event.eventCode,
            message: '이벤트가 성공적으로 생성되었습니다.',
            createdAt: event.createdAt,
        };
    }
}
