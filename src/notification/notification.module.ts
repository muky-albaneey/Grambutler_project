/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './gateway/notification.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { HttpModule } from '@nestjs/axios';


@Module({
   imports: [ TypeOrmModule.forFeature([Notification, User,]),HttpModule, UserModule],
  providers: [NotificationService, NotificationGateway],
  controllers: [NotificationController, NotificationGateway]
})
export class NotificationModule {}
