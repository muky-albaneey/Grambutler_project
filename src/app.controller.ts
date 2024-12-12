/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtGuard } from './guards/jwt.guards';
import { User } from './decorators/user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtGuard)
  @Get()
  getHello(@User('sub') userId: string, @User('email') email: string): string { 
    // Correct placement of @User decorator
    console.log('User ID:', userId);  // Will log the user ID from the payload
    console.log('User Email:', email);
    return this.appService.getHello();
  }
}
