import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from 'src/events/event.schema';
import { Enhancement, EnhancementDocument } from './enhancement.schema';

@Injectable()
export class EnhancementsService {
  constructor(
    @InjectModel(Enhancement.name)
    private readonly recordModel: Model<EnhancementDocument>,

    @InjectModel(Event.name)             // ← 이벤트 스키마도 주입
    private readonly eventModel: Model<EventDocument>,
  ) { }

  // 10% 확률로 강화 성공. 실패해도 기존 성공 횟수를 같이 반환.
  async attemptEnhancement(
    userCode: string,
    eventCode: string,
  ): Promise<{ success: boolean; successCount: number }> {
    // 0) 이 이벤트가 “무기 강화 이벤트”인지 검증
    const event = await this.eventModel.findOne({ eventCode }).lean();
    if (!event) {
      throw new BadRequestException('해당 이벤트를 찾을 수 없습니다.');
    }
    if (event.title !== '무기_강화_이벤트') {
      throw new BadRequestException('이벤트가 무기강화 이벤트가 아닙니다.');
    }

    // 1) 현재까지 누적된 성공 횟수 조회
    let rec = await this.recordModel.findOne({ userCode, eventCode });
    let successCount = rec?.successCount ?? 0;

    // 2) 10% 확률 시뮬레이션
    const success = Math.random() < 0.1;

    // 3) 성공했을 때만 카운트 증가
    if (success) {
      rec = await this.recordModel.findOneAndUpdate(
        { userCode, eventCode },
        { $inc: { successCount: 1 } },
        { upsert: true, new: true },
      )
      successCount = rec!.successCount;
    }

    return { success, successCount };
  }

  // 성공 횟수 조회
  async getSuccessCount(
    userCode: string,
    eventCode: string,
  ): Promise<number> {
    const rec = await this.recordModel.findOne({ userCode, eventCode });
    return rec?.successCount ?? 0;
  }
}

