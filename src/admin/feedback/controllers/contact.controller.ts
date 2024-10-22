import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { Contact } from '../entities/contact.entity';
import { CreateContactDto } from '../dto/contact.dto';
import { ContactService } from '../services/contact.service';
import { FilterDto } from 'src/utils/filter.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() createContactDto: CreateContactDto): Promise<Contact> {
    return this.contactService.create(createContactDto);
  }

  @Get()
  findAll(@Query() filter: FilterDto): Promise<Contact[]> {
    return this.contactService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Contact> {
    return this.contactService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<boolean> {
    return this.contactService.remove(id);
  }
}
