// // // import { Module } from '@nestjs/common';
// // // import { UserService } from './user.service';
// // // import { UserController } from './user.controller';
// // // import { TypeOrmModule } from '@nestjs/typeorm';
// // // import { User } from './entities/user.entity';
// // // import { JwtService } from '@nestjs/jwt';

// // // @Module({
// // //   imports: [TypeOrmModule.forFeature([User])],
// // //   controllers: [UserController],
// // //   providers: [UserService, JwtService],
// // // })
// // // export class UserModule {}
// // import { Module } from '@nestjs/common';
// // import { UserService } from './user.service';
// // import { UserController } from './user.controller';
// // import { TypeOrmModule } from '@nestjs/typeorm';
// // import { User } from './entities/user.entity';
// // import { JwtModule } from '@nestjs/jwt';
// // import { ConfigModule, ConfigService } from '@nestjs/config';
// // import { MailService } from 'src/mail/mail.service';

// // @Module({
// //   imports: [
// //     TypeOrmModule.forFeature([User]),
// //     JwtModule.registerAsync({
// //       imports: [ConfigModule],
// //       useFactory: async (configService: ConfigService) => ({
// //         secret: configService.get<string>('ACCESS_TOKEN'),
// //         signOptions: { expiresIn: '60s' },
// //       }),
// //       inject: [ConfigService],
// //     }),
// //   ],
// //   controllers: [UserController],
// //   providers: [UserService, MailService],
// // })
// // export class UserModule {}
// import { Module } from '@nestjs/common';
// import { UserService } from './user.service';
// import { UserController } from './user.controller';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './entities/user.entity';
// import { JwtModule, JwtService } from '@nestjs/jwt';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { MailService } from 'src/mail/mail.service';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([User]),
//     ConfigModule, // Ensure ConfigModule is imported
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       useFactory: async (configService: ConfigService) => ({
//         secret: configService.get<string>('ACCESS_TOKEN'),
//         signOptions: { expiresIn: '60s' },
//       }),
//       inject: [ConfigService],
//     }),
//   ],
//   exports: [TypeOrmModule],
//   controllers: [UserController],
//   providers: [JwtService, UserService, MailService],
// })
// export class UserModule {}
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import { Onboarding } from './entities/onoard.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Onboarding]),
    ConfigModule, // Ensure ConfigModule is imported
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_TOKEN'),
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
  controllers: [UserController],
  providers: [JwtService, UserService, MailService],
})
export class UserModule {}
