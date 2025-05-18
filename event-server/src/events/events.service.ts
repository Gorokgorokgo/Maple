import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event-dto';
import { EventDocument } from './event.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class EventsService {
    constructor(
        @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    ) { }

    // 이벤트 생성
    async createEvent(createEventDto: CreateEventDto) {
        const { title, startDate, endDate, conditions, status } = createEventDto;

        const newEvent = new this.eventModel({
            title,
            startDate,
            endDate,
            conditions,
            status,
        });

        return await newEvent.save();
    }

}
