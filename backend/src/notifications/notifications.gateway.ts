import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private onlineUsers: Map<string, string> = new Map();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.onlineUsers.set(userId, client.id);
      console.log(`User ${userId} connected: ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.onlineUsers.entries()) {
      if (socketId === client.id) {
        this.onlineUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  sendFollowNotification(toUserId: string, fromUsername: string) {
    const socketId = this.onlineUsers.get(toUserId);
    if (socketId) {
      this.server.to(socketId).emit('followNotification', {
        message: `${fromUsername} followed you`,
      });
    }
  }

  sendNotification(toUserId: string, message: string) {
    const socketId = this.onlineUsers.get(toUserId);
    if (socketId) {
      this.server.to(socketId).emit('notification', { message });
    }
  }
}
