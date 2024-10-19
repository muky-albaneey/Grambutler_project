import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import {
  EventRepository,
  RegisteredUserRepository,
} from './repositories/event.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentorshipEvent } from './entities/event.entity';
import { RegisteredUser } from './entities/registeredUsers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MentorshipEvent, RegisteredUser])],
  controllers: [EventsController],
  providers: [EventRepository, RegisteredUserRepository, EventsService],
})
export class EventsModule {}
