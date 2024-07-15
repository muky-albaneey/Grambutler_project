import { Injectable, UnauthorizedException } from '@nestjs/common';
import {   CreateAuthDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as path from 'path';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class UserService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}
  async create(createAuthDto: CreateAuthDto): Promise<any>{
    try {
      // Check if the user already exists
      
      const userValidate = await this.userRepository.findOne({
        where: { email: createAuthDto.email },
      });

      if (userValidate) {
        throw new UnauthorizedException('The user already exists!');
      }

      // Create and save the new user
      const newUser = await this.userRepository.create(createAuthDto);
      const userSaved = await this.userRepository.save(newUser);

      // Create token payload with necessary information (excluding sensitive data)
      
      return { user: userSaved };
      
    } catch (error) {
      // Handle errors, log or rethrow as needed
      console.error('User creation failed', error);
      throw error;
    }
    // return 'This action adds a new auth';
  }

  

  async login(createAuthDto: CreateAuthDto): Promise<any>{
    try {
      // Check if the user already exists
      
      const userValidate = await this.userRepository.findOne({
        where: { email: createAuthDto.email },
      });

      if (!userValidate) {
        throw new UnauthorizedException('The user does not exists!');
      }
      const isMatch = await bcrypt.compare(createAuthDto.password, userValidate.password);
      if (!isMatch) {
        throw new UnauthorizedException('The password does not exists!');
      }
      // Create and save the new user
      // const newUser = await this.userRepository.create(createAuthDto);
      // const userSaved = await this.userRepository.save(newUser);

      // Create token payload with necessary information (excluding sensitive data)
      
      return userValidate
      
    } catch (error) {
      // Handle errors, log or rethrow as needed
      console.error('User creation failed', error);
      throw error;
    }
    // return 'This action adds a new auth';
  }

}
