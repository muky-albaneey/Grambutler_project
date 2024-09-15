import { IsOptional, IsString, IsNotEmpty, IsEmail, MinLength, MaxLength, IsArray } from 'class-validator';

export class CreatePostDto {
    

    @IsNotEmpty()
    @IsString()   
    title: string;

    @IsNotEmpty()
    @IsString()   
    content: string;

    @IsNotEmpty()
    @IsString()   
    categoryName: string;
  }
  