import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateAuthDto, ForgotPass,  } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
// import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly configService: ConfigService, private readonly jwt: JwtService,) {}

  @Post('create')
  async create(@Body() createAuthDto: CreateAuthDto, @Res({ passthrough: true }) response: Response): Promise<any> {
    try {      
      
      const result = await this.userService.create(createAuthDto);
      const  email =  result.user.email
      const  id =  result.user.id
      const  role =  result.user.role
      const payload = { email: email, sub: id };
      const rolePayload = { role: role, sub: id };

      // Sign JWT for access token with a longer expiry time
      const jwtTokenKeys = await this.jwt.signAsync(payload, {
        expiresIn: '35s',
        secret: this.configService.get<string>('ACCESS_TOKEN'),   
      });

      // Sign JWT for refresh token with a longer expiry time
      const jwtRefreshTokenKeys = await this.jwt.signAsync(payload, {
        expiresIn: '7d',  
        secret: this.configService.get<string>('REFRESH_TOKEN'),   
      });

        // Sign JWT for role token with a longer expiry time
        const roleToken = await this.jwt.signAsync(rolePayload, {
          expiresIn: '7d',
          secret: this.configService.get<string>('ROLE_TOKEN'),   
        });

        // Set HttpOnly cookie for the access token
      response.cookie('accessToken', jwtTokenKeys, {
        // httpOnly: false,
        // secure: false,
        maxAge: 7 * 60 * 60 * 1000,  // 7 hours in milliseconds
        // path: '/',
        // sameSite: 'none',
      });

      // Set HttpOnly cookie for the refresh token (if needed)
      response.cookie('refreshToken', jwtRefreshTokenKeys, {
        // httpOnly: false,
        // secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        // path: '/', 
        // sameSite: 'none',
      });

      // Set HttpOnly cookie for the role token (if needed)
      response.cookie('roleToken', roleToken, {
        // httpOnly: true,
        // secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        // path: '/', 
        // sameSite: 'none',
      });
  return result;
    } catch (error) {
      console.error('User creation failed', error);
      throw error;
    }
  }

  @Post('login')
  async login(@Body() createAuthDto: CreateAuthDto, @Res({ passthrough: true }) response: Response): Promise<any> {
    // console.log(createAuthDto.email)
    // console.log(createAuthDto.password)
  try {      
    
    const result = await this.userService.login(createAuthDto);
    // console.log(result)
    const  email =  result.email
    const  id =  result.id
    const  role =  result.role
    const payload = { email: email, sub: id };
    const rolePayload = { role: role, sub: id };

    // Sign JWT for access token with a longer expiry time
    const jwtTokenKeys = await this.jwt.signAsync(payload, {
      expiresIn: '35s',
      secret: this.configService.get<string>('ACCESS_TOKEN'),   
    });

    // Sign JWT for refresh token with a longer expiry time
    const jwtRefreshTokenKeys = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: this.configService.get<string>('REFRESH_TOKEN'),   
    });

      // Sign JWT for role token with a longer expiry time
      const roleToken = await this.jwt.signAsync(rolePayload, {
        expiresIn: '7d',
        secret: this.configService.get<string>('ROLE_TOKEN'),   
      });

      // Set HttpOnly cookie for the access token
    response.cookie('accessToken', jwtTokenKeys, {
      // httpOnly: false,
      // secure: false,
      maxAge: 7 * 60 * 60 * 1000,  // 7 hours in milliseconds
      // path: '/',
      // sameSite: 'none',
    });

    // Set HttpOnly cookie for the refresh token (if needed)
    response.cookie('refreshToken', jwtRefreshTokenKeys, {
      // httpOnly: false,
      // secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      // path: '/', 
      // sameSite: 'none',
    });

    // Set HttpOnly cookie for the role token (if needed)
    response.cookie('roleToken', roleToken, {
      // httpOnly: true,
      // secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      // path: '/', 
      // sameSite: 'none',
    });
  return result;
  } catch (error) {
    console.error('User creation failed', error);
    throw error;
  }
}


@Patch('reset')
async resetPassword(@Body() userEmail: ForgotPass) {
  return this.userService.forgotPassword(userEmail)
}
}
