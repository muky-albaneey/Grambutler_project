import { Injectable } from '@nestjs/common';
import { ContactRepository } from '../repositories/contact.repository';
import { Contact } from '../entities/contact.entity';
import { CreateContactDto } from '../dto/contact.dto';
import { FilterDto } from 'src/utils/filter.dto';

@Injectable()
export class ContactService {
  constructor(private readonly contactRepository: ContactRepository) {}

  create(createContactDto: CreateContactDto): Promise<Contact> {
    return this.contactRepository.create(createContactDto);
  }

  findAll(filter: FilterDto): Promise<Contact[]> {
    return this.contactRepository.find({}, { ...filter });
  }

  findOne(id: string): Promise<Contact> {
    return this.contactRepository.findOne({ id });
  }

  remove(id: string): Promise<boolean> {
    return this.contactRepository.deleteMany({ id });
  }
}
