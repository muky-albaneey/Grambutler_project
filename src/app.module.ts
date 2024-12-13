/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { MailService } from './mail/mail.service';
import { Onboarding } from './user/entities/onoard.entity';
import { ProfileImage } from './user/entities/profile.entity';
import { Settings } from './user/entities/setting.entity';
import { StripeModule } from './stripe/stripe.module';
import { OpenaiModule } from './openai/openai.module';
import { ResponseEntity } from './user/entities/response.entity';
import { PromptEntity } from './user/entities/reponse_prompt.entity';
import { Post } from './user/entities/post.entity';
import { Comment } from './user/entities/comment.entity';
import { Like } from './user/entities/like.entity';
import { Category } from './user/entities/category.entity';
import { PostImage } from './user/entities/post-image.entity';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/entities/task.entity';
import { AdminModule } from './admin/admin.module';
import { Ebook } from './admin/ebooks/entities/ebook.entity';
import { MentorshipEvent } from './admin/events/entities/event.entity';
import { RegisteredUser } from './admin/events/entities/registeredUsers.entity';
import { PageImage, Plans } from './admin/website/entities/landingPage.entity';
import { Legal } from './admin/website/entities/legal.entity';
import {
  Question,
  Onboarding as AdminOnboarding,
} from './admin/website/entities/onboarding.entity';
import { Recommendation } from './admin/feedback/entities/recommendation.entity';
import { Feedback, Reply } from './admin/feedback/entities/feedback.entity';
import { Contact } from './admin/feedback/entities/contact.entity';
import { Category as AdminCategory } from './admin/community/entities/category.entity';
import { Discussion } from './admin/community/entities/discussion.entity';
import { Comment_task } from './tasks/entities/comment.entity';
// import { Comment_task } from 'src/tasks/entities/comment.entity.ts';
import { PaymentService } from './payment/payment.service';
import { Payment } from './user/entities/payment.entity';
import { PaymentModule } from './payment/payment.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        // host: configService.get<string>('DATABASE_DEV_HOST') || 'db', // Use 'db' as the default
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [
          User,
          Onboarding,
          ProfileImage,
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
          Comment_task,
          Ebook,
          MentorshipEvent,
          RegisteredUser,
          PageImage,
          Plans,
          Legal,
          AdminOnboarding,
          Question,
          Recommendation,
          Feedback,
          Reply,
          Contact,
          AdminCategory,
          Discussion,
          Payment
    
        ],
        synchronize: true
        // migrations: ['src/migrations/*.ts'],
      }),
    }),
    UserModule,
    PaymentModule,
    StripeModule,
    OpenaiModule,
    TasksModule,
    AdminModule,
    JwtModule
    
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
