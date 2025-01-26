/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './gateway/notification.gateway';

@Controller('notifications')
export class NotificationController {
  constructor(
    private notificationService: NotificationService,
    private notificationGateway: NotificationGateway // ✅ Inject NotificationGateway
  ) {}

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

  @Post('send')
  async sendNotification(@Body() body: { userId: string; message: string }) {
    this.notificationGateway.sendNotification(body.userId, { message: body.message }); // ✅ Use injected instance
    return { success: true };
  }
}
