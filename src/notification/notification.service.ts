/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { NotificationGateway } from './gateway/notification.gateway';
import { Notification } from './entities/notification.entity';


@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    @InjectRepository(User)
    private userRepo: Repository<User>,  // Inject User repository
    private notificationGateway: NotificationGateway, // Inject WebSocket gateway
  ) {}

  async createNotification(userId, type: string, title: string, message: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    const notification = this.notificationRepo.create({
      type,
      title,
      message,
      user,  // Associate the notification with the User entity
    });
    
    await this.notificationRepo.save(notification);

    // Emit real-time notification via WebSockets
    this.notificationGateway.sendNotification(userId, notification);

    return notification;
  }

  async markAsRead(id) {
    await this.notificationRepo.update(id, { read: true });
    return { message: 'Notification marked as read' };
  }

  async getUserNotifications(userId) {
    return this.notificationRepo.find({ where: { user: { id: userId } }, order: { createdAt: 'DESC' } });
  }
}
