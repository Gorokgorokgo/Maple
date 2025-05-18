import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from 'src/events/event.schema';
import { RewardDefinition, RewardDefinitionSchema } from './reward_definitions';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';
import { RewardRequest, RewardRequestSchema } from './reward-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RewardRequest.name,    schema: RewardRequestSchema },
      { name: RewardDefinition.name, schema: RewardDefinitionSchema },
      { name: Event.name, schema: EventSchema },
    ]),
  ],
  controllers: [RewardsController],
  providers: [RewardsService]
})
export class RewardsModule { }
