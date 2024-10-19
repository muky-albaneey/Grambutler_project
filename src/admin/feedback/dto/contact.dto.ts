import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  CompanySize,
  JobFunction,
  JobLevel,
} from '../interfaces/feedback.interface';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  website: string;

  @IsEnum(JobFunction)
  job: JobFunction;

  @IsEnum(JobLevel)
  level: JobLevel;

  @IsEnum(CompanySize)
  size: CompanySize;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  additionalInfo: string;
}
