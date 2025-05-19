import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardsModule } from './rewards/rewards.module';
import { EnhancementsModule } from './enhancements/enhancements.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    EventsModule,
    RewardsModule,
    EnhancementsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
