// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as cookieParser from 'cookie-parser';
// import { ValidationPipe } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as dotenv from 'dotenv';
// async function bootstrap() {

//     dotenv.config();
//   const app = await NestFactory.create(AppModule);
//   app.enableCors({
//     origin: true,
//     credentials: true,
//     methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'], // Include 'PATCH' in the allowed methods
//   });
//   app.use(cookieParser());

//   app.useGlobalPipes(new ValidationPipe({
//     whitelist : true,
//     forbidNonWhitelisted: true,
//     transform: true,
//   }));

//   const configService = app.get(ConfigService);
  
//   const PORT = configService.get<number>('PORT') || 3000;
//   await app.listen(PORT, '0.0.0.0', () => {
//     console.log(`Running in ${configService.get<string>('NODE_ENV')} on port ${PORT}`);
//   });
// }
// bootstrap();
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as express from 'express';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  // Middleware to parse raw body for Stripe webhooks
  app.use(express.json({
    verify: (req: express.Request, res: express.Response, buf: Buffer) => {
      if (req.originalUrl.startsWith('/stripe/webhook')) {
        (req as any).rawBody = buf; // Correctly store the raw body as a Buffer
      }
    }
  }));

  app.use(cookieParser());

  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'], // Include 'PATCH' in the allowed methods
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 3000;
  await app.listen(PORT, '0.0.0.0', () => {
    console.log(`Running in ${configService.get<string>('NODE_ENV')} on port ${PORT}`);
  });
}
bootstrap();
