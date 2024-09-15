import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum, IsInt, IsPositive } from 'class-validator';
import { Priority, TaskStatus } from '../enum/task.enums';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  guest?: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  dueDate: Date;

  @IsString()
  timeZone: string;

  @IsString()
  @IsOptional()
  repeat?: string;

  @IsEnum(Priority)
  priority: Priority;

  @IsEnum(TaskStatus)
  taskStatus: TaskStatus;

  @IsInt()
  @IsOptional()
  @IsPositive()
  startReminder?: number;

  @IsString()
  userId: string; 

  
}
