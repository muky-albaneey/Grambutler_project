// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import {   CreateAuthDto, ForgotPass } from './dto/create-user.dto';
// import { Repository } from 'typeorm';
// import { User } from './entities/user.entity';
// import * as path from 'path';
// import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';
// import { InjectRepository } from '@nestjs/typeorm';
// import { MailService } from 'src/mail/mail.service';


// @Injectable()
// export class UserService {
  
//   constructor(
//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//     private readonly emailservice : MailService
//   ){}
//   async create(createAuthDto: CreateAuthDto): Promise<any>{
//     try {    
//       // Check if the user already exists
      
//       const userValidate = await this.userRepository.findOne({
//         where: { email: createAuthDto.email },
//       });

//       if (userValidate) {
//         throw new UnauthorizedException('The user already exists!');
//       }

//       // Create and save the new user
//       const newUser = await this.userRepository.create(createAuthDto);
//       const userSaved = await this.userRepository.save(newUser);

//       // Create token payload with necessary information (excluding sensitive data)
      
//       return { user: userSaved };
      
//     } catch (error) {
//       // Handle errors, log or rethrow as needed
//       console.error('User creation failed', error);
//       throw error;
//     }
//     // return 'This action adds a new auth';
//   }

  

//   async login(createAuthDto: CreateAuthDto): Promise<any>{
//     try {
//       // Check if the user already exists
      
//       const userValidate = await this.userRepository.findOne({
//         where: { email: createAuthDto.email },
//       });
// console.log(userValidate.password);

//       if (!userValidate) {
//         throw new UnauthorizedException('The user does not exists!');
//       }
//       const isMatch = await bcrypt.compare(createAuthDto.password, userValidate.password);
//       if (!isMatch) {
//         throw new UnauthorizedException('The password does not exists!');
//       }
//       // Create and save the new user
//       // const newUser = await this.userRepository.create(createAuthDto);
//       // const userSaved = await this.userRepository.save(newUser);

//       // Create token payload with necessary information (excluding sensitive data)
      
//       return userValidate
      
//     } catch (error) {
//       // Handle errors, log or rethrow as needed
//       console.error('User creation failed', error);
//       throw error;
//     }
//     // return 'This action adds a new auth';
//   }


//   // FORGGOT PASSWORD SECTION
//   async getTokens(userEmail: ForgotPass){
//     const userValidate = await this.userRepository.findOne({
//       where: { email: userEmail.email },
//     });

//     if (!userValidate) {
//       throw new UnauthorizedException('The email address does not exists!');
//     }

//     // Generate a 5-digit token
//     const token = Math.floor(10000 + Math.random() * 90000).toString();

//     // Update the rememberToken field in the user entity
//       userValidate.rememberToken = token;
//       await this.userRepository.save(userValidate);

//       // Send the token via email
//       console.log(userValidate);
      
//       await this.emailservice.dispatchEmail(
//         userValidate.email,
//         'FORGOT PASSWORD TOKEN',
//         `Here is your token for password reset: ${token}`,
//         `<h1>${userValidate.rememberToken }</h1>`
//     );

//     return `Message has been sent to ur email mr: ${userValidate.full_name}`;
//   }

//   async validateTokens(tokenNum: string): Promise<string> {
//     console.log('Searching for token:', tokenNum);
//     const userValidate = await this.userRepository.findOne({
//       where: { rememberToken: tokenNum },
//     });

//     console.log('Query result:', userValidate);
//     if (!userValidate) {
//       throw new UnauthorizedException('The tokens are incorrect!');
//     }

//     // Confirm the tokens
//     // if (userValidate.rememberToken == tokenNum) return userValidate.rememberToken;
//     // throw new UnauthorizedException('The tokens are incorrect!');
//     return userValidate.rememberToken;
//   }

//   async changePassword(tokenNum: string, newPassword: string) {
//     const userValidate = await this.userRepository.findOne({
//       where: { rememberToken: tokenNum },
//     });
  
//     console.log('Token:', tokenNum);
//     console.log('User found:', userValidate);
//     console.log(newPassword);

    
//     if (!userValidate) {
//       throw new UnauthorizedException('The tokens are incorrect!');
//     }
  
//     console.log(userValidate.password);
//     // Hash the new password
//     // userValidate.password = newPassword
//     userValidate.password = await bcrypt.hash(newPassword, 10);
  
//     console.log(userValidate.password);
    
//     await this.userRepository.save(userValidate);
//     console.log('New hashed password:', userValidate.password);
  
//     return userValidate;
//   }
  



// }
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto, ForgotPass } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailservice: MailService
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async create(createAuthDto: CreateAuthDto): Promise<any> {
    try {
      const userValidate = await this.userRepository.findOne({
        where: { email: createAuthDto.email },
      });

      if (userValidate) {
        throw new UnauthorizedException('The user already exists!');
      }

      // Hash the password before saving
      createAuthDto.password = await this.hashPassword(createAuthDto.password);

      const newUser = await this.userRepository.create(createAuthDto);
      const userSaved = await this.userRepository.save(newUser);

      return { user: userSaved };
    } catch (error) {
      console.error('User creation failed', error);
      throw error;
    }
  }

  async login(createAuthDto: CreateAuthDto): Promise<any> {
    try {
      const userValidate = await this.userRepository.findOne({
        where: { email: createAuthDto.email },
      });

      if (!userValidate) {
        throw new UnauthorizedException('The user does not exist!');
      }

      const isMatch = await bcrypt.compare(createAuthDto.password, userValidate.password);
      if (!isMatch) {
        throw new UnauthorizedException('The password does not match!');
      }

      return userValidate;
    } catch (error) {
      console.error('User login failed', error);
      throw error;
    }
  }

  // FORGOT PASSWORD SECTION
  async getTokens(userEmail: ForgotPass) {
    const userValidate = await this.userRepository.findOne({
      where: { email: userEmail.email },
    });

    if (!userValidate) {
      throw new UnauthorizedException('The email address does not exist!');
    }

    const token = Math.floor(10000 + Math.random() * 90000).toString();

    userValidate.rememberToken = token;
    await this.userRepository.save(userValidate);

    await this.emailservice.dispatchEmail(
      userValidate.email,
      'FORGOT PASSWORD TOKEN',
      `
      this token will be expired imediately you changed your password
      password reset token: ${token} `,
      `<h1>${userValidate.rememberToken}</h1>`
    );

    return `Message has been sent to your email, ${userValidate.full_name}`;
  }

  async validateTokens(tokenNum: string): Promise<string> {
    const userValidate = await this.userRepository.findOne({
      where: { rememberToken: tokenNum },
    });

    if (!userValidate) {
      throw new UnauthorizedException('The tokens are incorrect!');
    }

    return userValidate.rememberToken;
  }

  async changePassword(tokenNum: string, newPassword: string) {
    console.log('Changing password for token:', tokenNum);

    const userValidate = await this.userRepository.findOne({
      where: { rememberToken: tokenNum },
    });

    if (!userValidate || tokenNum == undefined || tokenNum == null || tokenNum == '') {
      throw new UnauthorizedException('The tokens are incorrect!');
    }

    console.log('User found for password change:', userValidate);

    userValidate.password = await this.hashPassword(newPassword);
    userValidate.rememberToken = ''; // Clear token after successful password change
    await this.userRepository.save(userValidate);

    console.log('Password changed and token cleared for user:', userValidate);
    return userValidate;
  }
}
