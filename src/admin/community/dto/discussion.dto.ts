import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDiscussionDto {
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateDiscussionDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class CreateCommentDto {
  @IsOptional()
  id: number;

  @IsString()
  @IsNotEmpty()
  comment: string;
}
