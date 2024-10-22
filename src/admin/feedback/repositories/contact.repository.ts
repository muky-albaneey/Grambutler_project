import { EntityRepository } from 'src/utils/entity.repository';
import { Contact } from '../entities/contact.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class ContactRepository extends EntityRepository<Contact> {
  constructor(
    @InjectRepository(Contact)
    readonly contactModel: Repository<Contact>,
  ) {
    super(contactModel);
  }
}
