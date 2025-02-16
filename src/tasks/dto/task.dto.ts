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

  @IsOptional()
  @IsArray()
  @IsString({ each: true})
  @IsNotEmpty({ each: true})
  guest?: string[];  // Array of string

  @IsString()
  startDate: string;

  @IsString()
  @IsOptional()
  startTime: string;

  @IsString()
  dueDate: string;

  @IsString()
  @IsOptional()
  dueTime: string;

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
  taskColor: TaskColor;

  @IsString()
  userId: string; 

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateCommentDto)
  comments?: CreateCommentDto[];

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

}

// Define UpdateTaskDto with optional fields
export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true})
  @IsNotEmpty({ each: true})
  guest?: string[];  // Array of string

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  startTime: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  dueTime: string;

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
  taskColor?: TaskColor;

  @IsString()
  @IsOptional()
  userId?: string;

}
