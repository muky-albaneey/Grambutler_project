/* eslint-disable prettier/prettier */
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FilterDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  search: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  sort: string;

  @IsOptional()
  @IsInt()
  page: number;

  @IsOptional()
  @IsInt()
  limit: number;
}


export enum PeriodEnum {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
}

export class PeriodDto {
  @IsOptional()
  @IsEnum(PeriodEnum)
  period: PeriodEnum;
}