import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from 'src/events/event.schema';
import { Enhancement, EnhancementSchema } from './enhancement.schema';
import { EnhancementsController } from './enhancements.controller';
import { EnhancementsService } from './enhancements.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Enhancement.name, schema: EnhancementSchema },
      { name: Event.name, schema: EventSchema },

    ]),
  ],
  controllers: [EnhancementsController],
  providers: [EnhancementsService],
  exports: [EnhancementsService],
})
export class EnhancementsModule { }
