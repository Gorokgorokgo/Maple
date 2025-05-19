import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Counter, CounterSchema } from 'src/common/counter.schema';
import { EnhancementsModule } from 'src/enhancements/enhancements.module';
import { RewardRequest, RewardRequestSchema } from 'src/rewards/reward-request.schema';
import { RewardDefinition, RewardDefinitionSchema } from 'src/rewards/reward_definitions';
import { EventConditionService } from './event-condition.service';
import { EventSchema } from './event.schema';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Counter.name, schema: CounterSchema },
      { name: RewardDefinition.name, schema: RewardDefinitionSchema },
      { name: RewardRequest.name, schema: RewardRequestSchema },
    ]),
    EnhancementsModule,
  ],
  controllers: [EventsController],
  providers: [EventsService,
    EventConditionService,
  ],
})
export class EventsModule { }
