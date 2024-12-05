import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Question } from '../entities/onboarding.entity';
import { Type } from 'class-transformer';

export class CreateOnboardingDto {
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Question)
  questions: Question[];
}

export class UpdateOnboardingDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Question)
  questions: Question[];
}

// export class UpdateOnboardingQuestionDto {
//   @IsOptional()
//   @ValidateNested({ each: true })
//   @Type(() => Question)
//   questions: Question;
// }
