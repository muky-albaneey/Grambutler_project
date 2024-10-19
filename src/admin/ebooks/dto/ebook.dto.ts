import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BookCategory } from '../interfaces/ebook.interface';

export class CreateEbookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(BookCategory)
  category: BookCategory;

  // @IsString()
  // @IsNotEmpty()
  thumbnailURL: string;

  // @IsString()
  // @IsNotEmpty()
  pdfURL: string;
}

export class UpdateEbookDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  author: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(BookCategory)
  category: BookCategory;

  thumbnailURL: string;

  pdfURL: string;
}
