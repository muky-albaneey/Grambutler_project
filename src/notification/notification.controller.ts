/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Post()
  async createNotification(@Body() body: any) {
    return this.notificationService.createNotification(body.userId, body.type, body.title, body.message);
  }

  @Get(':userId')
  async getUserNotifications(@Param('userId') userId: string) {
    return this.notificationService.getUserNotifications(userId);
  }

  @Post(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }
}
