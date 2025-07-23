import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    private gateway: NotificationsGateway,
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {}

  async sendFollowNotification(toUserId: string, fromUsername: string) {
    const message = `${fromUsername} followed you`;

    // Real-time notification with proper structure
    this.gateway.sendNotification(toUserId, {
      type: 'follow',
      message,
      fromUserId: fromUsername, // This should be userId, but we'll use username for now
    });

    // Save to DB
    await this.notificationModel.create({ userId: toUserId, message });
  }

  async sendNotification(userId: string, payload: any) {
    const message = payload?.message || 'You have a new notification.';

    // Real-time notification
    this.gateway.sendNotification(userId, payload);

    // Save to DB
    await this.notificationModel.create({ userId, message });
  }

  async getNotifications(userId: string) {
    return this.notificationModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }
}
