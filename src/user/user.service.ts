import { Injectable, UnauthorizedException } from '@nestjs/common';
import {   CreateAuthDto, ForgotPass } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as path from 'path';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';


@Injectable()
export class UserService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailservice : MailService
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


  // FORGGOT PASSWORD SECTION
  async getTokens(userEmail: ForgotPass){
    const userValidate = await this.userRepository.findOne({
      where: { email: userEmail.email },
    });

    if (!userValidate) {
      throw new UnauthorizedException('The email address does not exists!');
    }

    // Generate a 5-digit token
    const token = Math.floor(10000 + Math.random() * 90000).toString();

    // Update the rememberToken field in the user entity
      userValidate.rememberToken = token;
      await this.userRepository.save(userValidate);

      // Send the token via email
      console.log(userValidate);
      
      await this.emailservice.dispatchEmail(
        userValidate.email,
        'FORGOT PASSWORD TOKEN',
        `Here is your token for password reset: ${token}`,
        `<h1>${token}</h1>`
    );

    return `Message has been sent to ur email mr: ${userValidate.full_name}`;
  }

  async validateTokens(tokenNum: string): Promise<string> {
    const userValidate = await this.userRepository.findOne({
      where: { rememberToken: tokenNum },
    });

    if (!userValidate) {
      throw new UnauthorizedException('The tokens are incorrect!');
    }

    // Confirm the tokens
    // if (userValidate.rememberToken == tokenNum) return userValidate.rememberToken;
    // throw new UnauthorizedException('The tokens are incorrect!');
    return userValidate.rememberToken;
  }

  async changePassword(tokenNum: string, password: string) {

    const userValidate = await this.userRepository.findOne({
      where: { rememberToken: tokenNum },
    });

    if (!userValidate) {
      throw new UnauthorizedException('the tokens does lease confirm the tokenns sent to your mail !');
    }

    userValidate.password = password;
    await this.userRepository.save(userValidate);

    // Additional logic for changing the password
  }



}
