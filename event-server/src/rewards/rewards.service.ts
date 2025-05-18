import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDocument } from 'src/events/event.schema';
import { CreateRewardRequestDto } from './dto/create-reward-request.dto';
import { CreateRewardResponseDto } from './dto/create-reward-response.dto';
import { GetRewardsHistoryResponseDto } from './dto/get-rewards-history-response.dto';
import { RewardHistoryItemDto } from './dto/reward-history-item.dto';
import { RewardRequest, RewardRequestDocument } from './reward-request.schema';
import { RewardDefinition, RewardDefinitionDocument } from './reward_definitions';
import { HistoryFilter } from 'src/common/history-filter';

@Injectable()
export class RewardsService {
    constructor(
        @InjectModel(RewardDefinition.name) private rewardDefModel: Model<RewardDefinitionDocument>,
        @InjectModel(RewardRequest.name) private readonly reqModel: Model<RewardRequestDocument>,
        @InjectModel(RewardDefinition.name) private readonly defModel: Model<RewardDefinitionDocument>,
        @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    ) { }

    // 이벤트 생성
    async createReward(dto: CreateRewardRequestDto): Promise<CreateRewardResponseDto> {
        const { eventCode, rewards } = dto;

        const event = await this.eventModel.findOne({ eventCode });
        if (!event) {
            throw new NotFoundException('해당 이벤트를 찾을 수 없습니다.');
        }
        // 등록한 보상이 있는지 확인
        const existed = await this.rewardDefModel.exists({ eventCode });
        // evt_00001 형식
        // upsert: 이미 있으면 덮어쓰기, 없으면 새로 생성
        const rewardDef = await this.rewardDefModel.findOneAndUpdate(
            { eventCode },
            { eventCode, rewards },
            {
                upsert: true,                // 없으면 생성
                new: true,                   // 업데이트 후 도큐먼트 반환
                setDefaultsOnInsert: true,   // 생성 시 스키마 기본값도 적용
            },
        );

        const message = existed
            ? '보상 내용이 수정 되었습니다.'
            : '보상내용이 등록되었습니다.';

        return {
            eventId: eventCode,
            message,
            rewardCount: rewardDef.rewards.length,
            definedAt: rewardDef.createdAt,
        };
    }

    // 지급 내역 조회
    async getHistory(filter: HistoryFilter): Promise<GetRewardsHistoryResponseDto> {
        // 1) 쿼리 빌드
        const query: any = {};
        if (filter.userCode) query.userCode = filter.userCode;
        if (filter.eventCode) query.eventCode = filter.eventCode;
        if (filter.status) query.status = filter.status;

        // 2) reward_requests 조회
        const requests = await this.reqModel.find(query).lean();

        // 3) 각 요청별로 보상 타입·값·이벤트 제목 결합
        const history: RewardHistoryItemDto[] = [];
        for (const r of requests) {
            // a) 이벤트 제목
            const ev = await this.eventModel
                .findOne({ eventCode: r.eventCode })
                .lean();
            if (!ev) throw new NotFoundException(`이벤트(${r.eventCode})를 찾을 수 없습니다.`);

            // b) 보상 정의
            const def = await this.defModel
                .findOne({ eventCode: r.eventCode })
                .lean();
            if (!def) throw new NotFoundException(`보상 정의(${r.eventCode})가 없습니다.`);

            // c) 정의된 보상 항목마다 하나씩 history에 추가
            for (const item of def.rewards) {
                history.push({
                    requestId: r._id.toString(),
                    userCode: r.userCode,
                    eventTitle: ev.title,
                    rewardType: item.type,
                    rewardValue: item.value.toString(),
                    status: r.status,
                    rewardedAt: r.rewardedAt!,
                });
            }
        }

        return {
            total: history.length,
            history,
        };
    }
}
