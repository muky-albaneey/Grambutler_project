import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'], // Include 'PATCH' in the allowed methods
  });
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({
    whitelist : true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const configService = app.get(ConfigService);
  
  console.log('ACCESS_TOKEN:', configService.get<string>('ACCESS_TOKEN'));
  console.log('REFRESH_TOKEN:', configService.get<string>('REFRESH_TOKEN'));
  console.log('ROLE_TOKEN:', configService.get<string>('ROLE_TOKEN'));
  console.log('Database Username:', configService.get<string>('DATABASE_USERNAME'));
  console.log('Database Password:', configService.get<string>('DATABASE_PASSWORD'));
  console.log('Database Name:', configService.get<string>('DATABASE_NAME'));
  const PORT = configService.get<string>('PORT') || 3000;
  await app.listen(PORT, '0.0.0.0', () => {
    console.log(`Running in ${process.env.NODE_ENV} on port ${PORT}`);
  });
}
bootstrap();
