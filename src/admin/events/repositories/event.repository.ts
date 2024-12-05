import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepository } from 'src/utils/entity.repository';
import { MentorshipEvent } from '../entities/event.entity';
import { RegisteredUser } from '../entities/registeredUsers.entity';

export class EventRepository extends EntityRepository<MentorshipEvent> {
  constructor(
    @InjectRepository(MentorshipEvent)
    readonly eventModel: Repository<MentorshipEvent>,
  ) {
    super(eventModel);
  }
}

export class RegisteredUserRepository extends EntityRepository<RegisteredUser> {
  constructor(
    @InjectRepository(RegisteredUser)
    readonly registeredUserModel: Repository<RegisteredUser>,
  ) {
    super(registeredUserModel);
  }
}
