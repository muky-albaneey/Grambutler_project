import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EventType } from '../interfaces/events.interface';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(EventType)
  eventType: EventType;

  @IsDateString()
  date: Date;

  @IsString()
  @IsNotEmpty()
  time: string;

  thumbnailURL: string;

  @IsString()
  @IsNotEmpty()
  link: string;
}

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(EventType)
  eventType: EventType;

  @IsDateString()
  date: Date;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  time: string;

  thumbnailURL: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  link: string;
}

export class CreateRegistrationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}
