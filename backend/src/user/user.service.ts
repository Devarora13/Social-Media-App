import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async createUser(data: Partial<User>) {
    const user = new this.userModel(data);
    return user.save();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findById(id: string) {
    return this.userModel.findById(id);
  }

  async followUser(currentUserId: string, targetUserId: string) {
  if (currentUserId === targetUserId) return;

  const currentUser = await this.userModel.findById(currentUserId);
  const targetUser = await this.userModel.findById(targetUserId);

  if (!currentUser || !targetUser) return;

  if (!targetUser.followers.includes(currentUserId)) {
    targetUser.followers.push(currentUserId);
    currentUser.following.push(targetUserId);
    await targetUser.save();
    await currentUser.save();

    // Send real-time notification
    this.notificationsGateway.sendFollowNotification(
      targetUserId,
      currentUser.username,
    );
  }
}


  async unfollowUser(currentUserId: string, targetUserId: string) {
    const currentUser = await this.userModel.findById(currentUserId);
    const targetUser = await this.userModel.findById(targetUserId);

    if (!currentUser || !targetUser) {
      throw new NotFoundException('User not found');
    }

    currentUser.following = currentUser.following.filter(
      (id) => id !== targetUserId
    );
    targetUser.followers = targetUser.followers.filter(
      (id) => id !== currentUserId
    );

    await currentUser.save();
    await targetUser.save();

    return { message: 'Unfollowed successfully' };
  }
}
