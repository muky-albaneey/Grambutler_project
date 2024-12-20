import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { MentorshipEvent } from './entities/event.entity';
import {
  CreateEventDto,
  CreateRegistrationDto,
  UpdateEventDto,
} from './dto/event.controller';
import { RegisteredUser } from './entities/registeredUsers.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileInterceptor } from 'src/utils/file.validator';
import { FilterDto } from 'src/utils/filter.dto';
import { User } from 'src/decorators/user.decorator';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('thumbnail', fileInterceptor))
  create(
    @Body() createEventDto: CreateEventDto,
    @User('sub') userId: string,
    @UploadedFile() thumbnail: Express.Multer.File,
  ): Promise<MentorshipEvent> {
    createEventDto.thumbnailURL = thumbnail?.filename;
    return this.eventsService.create(createEventDto, userId);
  }

  @Post('/register')
  register(
    @Body() createRegistrationDto: CreateRegistrationDto,
  ): Promise<RegisteredUser> {
    return this.eventsService.register(createRegistrationDto);
  }

  @Get()
  findAll(@Query() filter: FilterDto): Promise<MentorshipEvent[]> {
    return this.eventsService.findAll(filter);
  }

  @Get('/register')
  findAllRegistered(): Promise<RegisteredUser[]> {
    return this.eventsService.findAllRegistered();
  }

  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<MentorshipEvent> {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('thumbnail', fileInterceptor))
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateEventDto: UpdateEventDto,
    @UploadedFile() thumbnail: Express.Multer.File,
  ): Promise<MentorshipEvent> {
    return this.eventsService.update(id, updateEventDto, thumbnail);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<boolean> {
    return this.eventsService.remove(id);
  }

  @Delete('/register/:id')
  removeRegistered(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<boolean> {
    return this.eventsService.removeRegistered(id);
  }
}
