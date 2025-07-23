import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: true })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users = new Map<string, string>(); // userId => socket.id

  constructor(private jwtService: JwtService) {}

  async handleConnection(socket: Socket) {
    const token = socket.handshake.auth.token;

    try {
      const payload = this.jwtService.verify(token);
      this.users.set(payload.userId, socket.id);
    } catch (err) {
      socket.disconnect(true);
    }
  }

  handleDisconnect(socket: Socket) {
    for (const [userId, socketId] of this.users.entries()) {
      if (socketId === socket.id) {
        this.users.delete(userId);
        break;
      }
    }
  }

  sendNotification(toUserId: string, message: string) {
    const socketId = this.users.get(toUserId);
    if (socketId) {
      this.server.to(socketId).emit('notification', { message });
    }
  }
}
