/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from 'src/notification/entities/notification.entity';
// import { NotificationType } from 'src/notification/entities/notification.enum';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    // @InjectRepository(Notification)
    // private notificationRepository: Repository<Notification>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepo: Repository<User>,  // Inject User repository
  ) {}

  async createNotification(userId, type: NotificationType, title: string, message: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } }); // Fetch user first
    if (!user) {
      throw new Error('User not found'); // Handle missing user
    }
  
    const notification = this.notificationRepository.create({
      user, // Assign the user entity
      type,
      title,
      message,
      read: false,
    });
  
    return this.notificationRepository.save(notification);
  }
  async getUserNotifications(userId) {
    return this.notificationRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id) {
    await this.notificationRepository.update(id, { read: true });
    return { message: 'Notification marked as read' };
  }
}
