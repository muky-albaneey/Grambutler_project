import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { FeedbackStatus } from '../interfaces/feedback.interface';

export class CreateFeedbackDto {
  @IsUUID()
  recommendationId: string;

  @IsString()
  @IsNotEmpty()
  feedbackText: string;
}

export class UpdateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  feedbackText: string;
}

export class UpdateFeedbackStatusDto {
  @IsEnum(FeedbackStatus)
  status: FeedbackStatus;
}

export class CreateReplyDto {
  @IsString()
  @IsNotEmpty()
  comment: string;
}

export class UpdateReplyDto {
  @IsString()
  @IsNotEmpty()
  comment: string;
}
