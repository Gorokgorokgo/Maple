import { BadRequestException, Injectable } from '@nestjs/common';
import { EnhancementsService } from 'src/enhancements/enhancements.service';
import { EventDocument } from './event.schema';

@Injectable()
export class EventConditionService {
  constructor(
    private readonly enhancementsService: EnhancementsService,
  ) { }

  // event.conditions 동적으로 검사하는 예시
  async check(userCode: string, event: EventDocument): Promise<void> {
    for (const cond of event.conditions) {
      switch (cond) {
        case '무기강화_3번_성공':
          const count = await this.enhancementsService.getSuccessCount(
            userCode,
            event.eventCode,
          );
          if (count < 3) {
            throw new BadRequestException(
              '강화 3회 성공 후에만 보상을 요청할 수 있습니다.',
            );
          }
          break;

        // case 'another_condition':
        //   // future 조건 로직
        //   break;

        default:
          throw new BadRequestException(
            `알 수 없는 조건입니다: ${cond}`
          );
      }
    }
  }
}
