import { Injectable, NotFoundException } from '@nestjs/common';
import {
  EventRepository,
  RegisteredUserRepository,
} from './repositories/event.repository';
import { MentorshipEvent } from './entities/event.entity';
import {
  CreateEventDto,
  CreateRegistrationDto,
  UpdateEventDto,
} from './dto/event.controller';
import { RegisteredUser } from './entities/registeredUsers.entity';
import { join } from 'path';
import * as fs from 'fs';
import { FilterDto } from 'src/utils/filter.dto';

@Injectable()
export class EventsService {
  constructor(
    private readonly eventsRepository: EventRepository,
    private readonly registeredUserRepository: RegisteredUserRepository,
  ) {}

  create(createEventDto: CreateEventDto): Promise<MentorshipEvent> {
    return this.eventsRepository.create(createEventDto);
  }

  register(
    createRegistrationDto: CreateRegistrationDto,
  ): Promise<RegisteredUser> {
    return this.registeredUserRepository.create(createRegistrationDto);
  }

  findAll(filter: FilterDto): Promise<MentorshipEvent[]> {
    return this.eventsRepository.find({}, { ...filter });
  }

  findAllRegistered(): Promise<RegisteredUser[]> {
    return this.registeredUserRepository.find({});
  }

  findOne(id: string): Promise<MentorshipEvent> {
    return this.eventsRepository.findOne({ id });
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
    thumbnail: Express.Multer.File,
  ) {
    const event = await this.eventsRepository.findOne({ id });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Update files only if they are provided in the request
    if (thumbnail) {
      // Delete the old thumbnail file
      if (event.thumbnailURL) {
        try {
          const oldThumbnailPath = join(
            __dirname,
            '../../uploads',
            event.thumbnailURL,
          );
          fs.unlinkSync(oldThumbnailPath);
        } catch (error) {
          throw new NotFoundException(
            'The current file on the event could not be found',
          );
        }
      }

      // Update with new file name
      updateEventDto.thumbnailURL = thumbnail.filename;
    }

    return this.eventsRepository.findOneAndUpdate({ id }, updateEventDto);
  }

  remove(id: string): Promise<boolean> {
    return this.eventsRepository.deleteMany({ id });
  }

  removeRegistered(id: string): Promise<boolean> {
    return this.registeredUserRepository.deleteMany({ id });
  }
}
