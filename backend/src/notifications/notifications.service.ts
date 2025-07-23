import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(private gateway: NotificationsGateway) {}

  sendFollowNotification(toUserId: string, fromUsername: string) {
    this.gateway.sendFollowNotification(toUserId, fromUsername);
  }
}
