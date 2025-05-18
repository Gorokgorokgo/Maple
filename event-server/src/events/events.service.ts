import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Counter, CounterDocument } from 'src/common/counter.schema';
import { EventStatus } from 'src/common/enums/event-status.enum';
import { RewardRequestStatus } from 'src/common/enums/reward-request-status.enum';
import { RewardRequest, RewardRequestDocument } from 'src/rewards/reward-request.schema';
import { RewardDefinition, RewardDefinitionDocument } from 'src/rewards/reward_definitions';
import { CreateEventRequestDto } from './dto/create-event-request.dto';
import { CreateEventResponseDto } from './dto/create-event-response-dto';
import { CreateRewardRequestResponseDto } from './dto/create-reward-request-response.dto';
import { EventDocument } from './event.schema';

@Injectable()
export class EventsService {
    constructor(
        @InjectModel(Event.name)
        private eventModel: Model<EventDocument>,
        @InjectModel(Counter.name)
        private counterModel: Model<CounterDocument>,
        @InjectModel(RewardDefinition.name)
        private readonly defModel: Model<RewardDefinitionDocument>,
        @InjectModel(RewardRequest.name)
        private readonly reqModel: Model<RewardRequestDocument>,

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

    // 유저 이벤트 보상 요청
    async createRewardRequest(userCode: string, eventCode: string): Promise<CreateRewardRequestResponseDto> {
        // 1) 이벤트 확인
        const event = await this.eventModel.findOne({ eventCode });
        if (!event) {
            throw new NotFoundException('해당 이벤트를 찾을 수 없습니다.');
        }

        // 2) 활성화 상태 확인
        if (event.status !== EventStatus.ACTIVE) {
            throw new BadRequestException('비활성화된 이벤트입니다.');
        }

        // 3) 보상 정의 확인
        const def = await this.defModel.findOne({ eventCode });
        if (!def) {
            throw new NotFoundException('이벤트 보상 정의가 없습니다.');
        }

        // 4) 중복 요청 방지
        const exists = await this.reqModel.exists({ userCode, eventCode });
        if (exists) {
            throw new ConflictException('이미 보상을 요청하셨습니다.');
        }

        // 5) 보상 요청 생성
        const created = await this.reqModel.create({
            userCode,
            eventCode,
            status: RewardRequestStatus.PENDING,
            requestedAt: new Date(),
        });

        return {
            eventCode,
            requestId: (created._id as Types.ObjectId).toString(),
            message: '보상이 성공적으로 요청되었습니다.',
            status: created.status,
            requestedAt: created.requestedAt,
        };
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
        console.log('저장 직전:', newEvent);


        return {
            eventId: event.eventCode,
            message: '이벤트가 성공적으로 생성되었습니다.',
            createdAt: event.createdAt,
        };
    }
}
