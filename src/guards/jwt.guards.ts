/* eslint-disable prettier/prettier */
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';


// @Injectable()
// export class JwtGuard implements CanActivate {

//     constructor(private readonly jwt: JwtService, private readonly configService: ConfigService,) {}

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const request = context.switchToHttp().getRequest();
//         const token = this.extractTokenFromCookies(request);
//     console.log(token)
//         if (!token) {
//             throw new UnauthorizedException();
//         }

//         try {
//             const payload = await this.jwt.verifyAsync(token, {
//                 secret: this.configService.get<string>('ROLE_TOKEN'),  
//             });
//             request['userId'] = payload;

//         } catch {
//             throw new UnauthorizedException();
//         }

//         return true;
//     }

//     private extractTokenFromCookies(req: Request) {
//         // console.log(req.cookies?.roleToken)
//         return req.cookies?.roleToken; // Replace 'yourCookieName' with the actual name of your cookie
//     }

// }
@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookies(request);
    console.log('Extracted Token:', token);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      // Verify and decode the token
      const payload = await this.jwt.verifyAsync(token, {
        secret: this.configService.get<string>('ROLE_TOKEN'), // Replace with your secret key
      });

      console.log('Decoded Payload:', payload); // Debug: Log payload to inspect structure

      // Set userId on the request object
      request['userId'] = payload.sub || payload.id || payload.userId; // Replace with the key in your JWT payload
      console.log('User ID set in request:', request['userId']);
    } catch (err) {
      console.error('Token verification failed:', err.message);
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  private extractTokenFromCookies(req: Request): string | undefined {
    // Assuming the cookie name is 'roleToken'
    return req.cookies?.roleToken;
  }
}
