/* eslint-disable prettier/prettier */
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ 
  cors: {
    origin: '*', // Allow all origins (adjust for security)
    methods: ['GET', 'POST']
  }
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  sendNotification(userId: string, payload: any) {
    console.log(`Sending notification to ${userId}`, payload);
    this.server.to(userId).emit('notification', payload);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() userId: string, client: Socket) {
    console.log(`User ${userId} joined room`);
    client.join(userId);
  }
}
