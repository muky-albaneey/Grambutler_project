import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService,  } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { MailService } from './mail/mail.service';


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
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User],
        synchronize: true,
      }),
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
// import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { UserModule } from './user/user.module';
// import { User } from './user/entities/user.entity';
// import { MailService } from './mail/mail.service';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//     }),
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: process.env.DB_HOST || 'db',
//       port: parseInt(process.env.DB_PORT, 10) || 5432,
//       username: process.env.DB_USERNAME || 'muky_albany',
//       password: process.env.DB_PASSWORD || 'iOoWAcFOvQUPnqooXU9II2kvNLgd7KQ0',
//       database: process.env.DB_NAME || 'grambutler',
//       entities: [User],
//       synchronize: true,
//     }),
//     UserModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService, MailService],
// })
// export class AppModule {}
