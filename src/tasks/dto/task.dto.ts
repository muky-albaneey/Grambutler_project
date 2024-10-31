/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum, IsInt, IsPositive, IsArray, ValidateNested } from 'class-validator';
import { Priority, TaskColor, TaskStatus } from '../enum/task.enums';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  guest?: string[];  // Array of string

  @IsDateString()
  startDate: string;

  @IsDateString()
  dueDate: string;

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
  @IsNotEmpty()
  taskStar: string; 

  @IsEnum(TaskColor)
  TaskColor: TaskColor;

  @IsString()
  userId: string; 

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateCommentDto)
  comments?: CreateCommentDto[];


  @IsString()
  @IsOptional()
  star?: string;
}

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  taskId: string; // ID of the task this comment belongs to

  @IsString()
  @IsNotEmpty()
  userId: string; // ID of the user creating the comment


  @IsString()
  @IsOptional()
  star?: string;
}

// Define UpdateTaskDto with optional fields
export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  guest?: string[];  // Array of string

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  timeZone?: string;

  @IsString()
  @IsOptional()
  repeat?: string;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsEnum(TaskStatus)
  @IsOptional()
  taskStatus?: TaskStatus;

  @IsInt()
  @IsOptional() 
  @IsPositive()
  startReminder?: number;

  @IsString()
  @IsOptional()
  taskStar?: string;  // userId

  @IsEnum(TaskColor)
  @IsOptional()
  TaskColor?: TaskColor;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  star?: string;
}
