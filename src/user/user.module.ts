/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import { Onboarding } from './entities/onoard.entity';
import { ProfileImage } from './entities/profile.entity';
import { Settings } from './entities/setting.entity';
import { ResponseEntity } from './entities/response.entity';
import { PromptEntity } from './entities/reponse_prompt.entity';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { Category } from './entities/category.entity';
import { PostImage } from './entities/post-image.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { OpenaiService } from 'src/openai/openai.service';
import { S3Service } from './s3/s3.service';
import { Subscription } from './entities/subscription.entity';
import { Payment } from './entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Onboarding,
      ProfileImage,
      Settings,
      ResponseEntity,
      PromptEntity,
      Post,
      Comment,
      Like,
      Category,
      PostImage,
      Task,
      Subscription,
      Payment
    ]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_TOKEN'),
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule, S3Service],
  controllers: [UserController],
  providers: [OpenaiService, JwtService, UserService, MailService, S3Service],
})
export class UserModule {}
