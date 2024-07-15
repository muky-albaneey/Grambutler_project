import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateAuthDto) {}
