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
import { FilterDto } from 'src/utils/filter.dto';
import { S3Service } from 'src/user/s3/s3.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly eventsRepository: EventRepository,
    private readonly registeredUserRepository: RegisteredUserRepository,
    private s3Service: S3Service,
  ) {}

  create(
    createEventDto: CreateEventDto,
    userId: string,
  ): Promise<MentorshipEvent> {
    return this.eventsRepository.create({
      ...createEventDto,
      createdBy: userId,
    });
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
        //TODO: Delete old file
      }

      // Update with new file name
      updateEventDto.thumbnailURL = await this.s3Service.uploadFile(thumbnail);
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
