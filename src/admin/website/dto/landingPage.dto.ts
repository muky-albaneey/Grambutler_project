import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ImageCategory } from '../interfaces/website.interface';

export class CreatePageImageDto {
  @IsEnum(ImageCategory)
  category: ImageCategory;

  @IsString()
  @IsNotEmpty()
  imageName: string;

  imageURL: string;
}

export class UpdatePageImageDto {
  @IsOptional()
  @IsEnum(ImageCategory)
  category: ImageCategory;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  imageName: string;

  imageURL: string;
}

export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  access: string[];

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  features: string[];
}

export class UpdatePlanDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  access: string[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  price: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  features: string[];
}
