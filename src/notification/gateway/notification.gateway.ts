/* eslint-disable prettier/prettier */
  import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
  import { Server } from 'socket.io';

  @WebSocketGateway({ cors: true })
  export class NotificationGateway {
    @WebSocketServer()
    server: Server;

    sendNotification(userId: string, payload: any) {
      this.server.to(userId).emit('notification', payload);
    }

    @SubscribeMessage('joinRoom') // Allows clients to listen for their notifications
    handleJoinRoom(@MessageBody() userId: string, client: any) {
      client.join(userId);
    }
  }
