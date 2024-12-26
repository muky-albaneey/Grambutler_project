import { IsEnum, IsDateString } from 'class-validator';
import { Plan } from '../entities/subscription.entity';
// import { Plan } from './subscription.entity';

export class CreateSubscriptionDto {
  @IsEnum(Plan)
  plan: Plan; // Ensures the plan is one of the allowed values

  @IsDateString()
  endDate: string; // Ensures the date is valid
}
