import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDocument } from 'src/events/event.schema';
import { CreateRewardRequestDto } from './dto/create-reward-request.dto';
import { CreateRewardResponseDto } from './dto/create-reward-response.dto';
import { RewardDefinition, RewardDefinitionDocument } from './reward_definitions';

@Injectable()
export class RewardsService {
    constructor(
        @InjectModel(RewardDefinition.name) private rewardDefModel: Model<RewardDefinitionDocument>,
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
}
