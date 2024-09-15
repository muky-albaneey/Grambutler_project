import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService,  } from '@nestjs/config';
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


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true
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
        entities: [User, Onboarding, ProfileImage, ProfileImage, Settings, ResponseEntity, PromptEntity, Post, Comment, Like, Category, PostImage, Task],
        synchronize: true,
        // migrations: ['src/migrations/*.ts'],
      }),
    }),
    UserModule,
    StripeModule,
    OpenaiModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}