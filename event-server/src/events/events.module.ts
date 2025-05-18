import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './event.schema';
import { Counter, CounterSchema } from 'src/common/counter.schema';
import { RewardDefinition, RewardDefinitionSchema } from 'src/rewards/reward_definitions';
import { RewardRequest, RewardRequestSchema } from 'src/rewards/reward-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema },
      { name: Counter.name, schema: CounterSchema },
      { name: RewardDefinition.name, schema: RewardDefinitionSchema },
      { name: RewardRequest.name,   schema: RewardRequestSchema },
    ]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule { }
