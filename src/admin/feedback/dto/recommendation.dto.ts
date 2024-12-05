import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RecommendationStatus } from '../interfaces/feedback.interface';

export class CreateRecommendationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateRecommendationDto {
  @IsOptional()
  @IsEnum(RecommendationStatus)
  status: RecommendationStatus;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;
}
