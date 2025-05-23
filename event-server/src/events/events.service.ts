import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Counter, CounterDocument } from 'src/common/counter.schema';
import { EventStatus } from 'src/common/enums/event-status.enum';
import { RewardRequestStatus } from 'src/common/enums/reward-request-status.enum';
import { EnhancementsService } from 'src/enhancements/enhancements.service';
import { RewardRequest, RewardRequestDocument } from 'src/rewards/reward-request.schema';
import { RewardDefinition, RewardDefinitionDocument } from 'src/rewards/reward_definitions';
import { CreateEventRequestDto } from './dto/create-event-request.dto';
import { CreateEventResponseDto } from './dto/create-event-response.dto';
import { CreateRewardRequestResponseDto } from './dto/create-reward-request-response.dto';
import { GetMyRewardsResponseDto } from './dto/get-my-rewards-response.dto';
import { RewardSummaryDto } from './dto/reward-summary.dto';
import { EventConditionService } from './event-condition.service';
import { EventDocument } from './event.schema';

@Injectable()
export class EventsService {
    private readonly logger = new Logger(EventsService.name);
    constructor(
        @InjectModel(Event.name)
        private eventModel: Model<EventDocument>,
        @InjectModel(Counter.name)
        private counterModel: Model<CounterDocument>,
        @InjectModel(RewardDefinition.name)
        private readonly defModel: Model<RewardDefinitionDocument>,
        @InjectModel(RewardRequest.name)
        private readonly reqModel: Model<RewardRequestDocument>,

        private readonly enhancementsService: EnhancementsService,
        private readonly eventConditionService: EventConditionService,

    ) {
        this.logger.log('constructor - eventConditionService = ' +
            (this.eventConditionService ? 'INJECTED' : 'undefined'));
    }



    // Code +1씩 카운트
    async getNextSequence(name: string): Promise<number> {
        const result = await this.counterModel.findOneAndUpdate(
            { name },
            { $inc: { seq: 1 } },
            { new: true, upsert: true },
        );
        return result.seq;
    }

    // 본인 보상 요청 이력 조회
    async getMyRewards(
        userCode: string,
    ): Promise<GetMyRewardsResponseDto> {
        // 1) userCode로 요청 기록만 조회
        const docs = await this.reqModel
            .find({ userCode })
            .sort({ requestedAt: -1 })
            .lean();

        // 2) 이벤트 제목 가져와서 DTO 변환
        const rewards: RewardSummaryDto[] = [];
        for (const r of docs) {
            const ev = await this.eventModel
                .findOne({ eventCode: r.eventCode })
                .lean();
            if (!ev) {
                throw new NotFoundException(`이벤트(${r.eventCode})를 찾을 수 없습니다.`);
            }
            rewards.push({
                eventCode: r.eventCode,
                eventTitle: ev.title,
                requestedAt: r.requestedAt,
                status: r.status,
            });
        }

        return { userCode, rewards };
    }

    // 유저 이벤트 보상 요청
    async createRewardRequest(
        userCode: string,
        eventCode: string,
    ): Promise<CreateRewardRequestResponseDto> {
        const now = new Date();

        // 1) 이벤트 조회
        const event = await this.eventModel.findOne({ eventCode });
        if (!event) {
            throw new NotFoundException('해당 이벤트를 찾을 수 없습니다.');
        }

        // 2) 기간 전 종료/미시작 체크 (시작 전 / 종료 후 바로 메시지 리턴)
        if (now < event.startDate) {
            return {
                eventCode,
                requestId: null,
                message: '이벤트 기간이 시작되지 않았습니다.',
                status: RewardRequestStatus.FAILED,
                requestedAt: null,
                rewardedAt: null,
            };
        }
        if (now > event.endDate) {
            return {
                eventCode,
                requestId: null,
                message: '이벤트 기간이 종료되었습니다.',
                status: RewardRequestStatus.FAILED,
                requestedAt: null,
                rewardedAt: null,
            };
        }

        // 3) 활성화 상태 확인
        if (event.status !== EventStatus.ACTIVE) {
            throw new BadRequestException('비활성화된 이벤트입니다.');
        }

        // 4) 보상 정의 조회
        const def = await this.defModel.findOne({ eventCode });
        if (!def) {
            throw new NotFoundException('이벤트 보상 정의가 없습니다.');
        }

        // ------------------------

        // 5) 조건 검증 (별도 서비스)
        await this.eventConditionService.check(userCode, event);

        // 6) 기존 요청 이력 조회
        let rec = await this.reqModel.findOne({ userCode, eventCode });
        let status: RewardRequestStatus;
        let message: string;

        if (!rec) {
            // ──────────────────────────────────────────────
            // 최초 요청
            // ──────────────────────────────────────────────
            rec = new this.reqModel({ userCode, eventCode });
            status = RewardRequestStatus.PENDING;
            message = '보상 요청이 접수되었습니다. 기간이 종료된 후 지급됩니다.';
        } else if (rec.status !== RewardRequestStatus.FAILED) {
            // ──────────────────────────────────────────────
            // 중복 요청 또는 종료 후 승격
            // ──────────────────────────────────────────────
            if (now <= event.endDate) {
                // 기간 내 -> 무조건 중복
                status = RewardRequestStatus.DUPLICATE;
                message = '이미 보상을 요청하셨습니다.';
            } else {
                // 기간 후 -> PENDING/DUPLICATE -> REWARDED 로 승격
                status = RewardRequestStatus.REWARDED;
                message = '보상이 성공적으로 지급되었습니다.';
                rec.rewardedAt = now;
            }
        } else {
            // ──────────────────────────────────────────────
            // FAILED 이력 재시도
            // ──────────────────────────────────────────────
            if (now <= event.endDate) {
                status = RewardRequestStatus.PENDING;
                message = '보상 요청이 재접수되었습니다. 기간이 종료된 후 지급됩니다.';
            } else {
                status = RewardRequestStatus.REWARDED;
                message = '보상이 성공적으로 지급되었습니다.';
                rec.rewardedAt = now;
            }
        }

        // 7) 상태/요청일 업데이트 후 저장
        rec.status = status;
        rec.requestedAt = now;
        await rec.save();

        // 8) DTO 변환 후 반환
        return {
            eventCode: rec.eventCode,
            requestId: (rec._id as Types.ObjectId).toString(),
            message,
            status: rec.status,
            requestedAt: rec.requestedAt,
            rewardedAt: rec.rewardedAt,
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


function toDto(
    rec: RewardRequestDocument,
    message: string,
): CreateRewardRequestResponseDto {
    return {
        eventCode: rec.eventCode,
        requestId: (rec._id as Types.ObjectId).toString(),
        message,
        status: rec.status,
        requestedAt: rec.requestedAt,
        rewardedAt: rec.rewardedAt,
    };
}