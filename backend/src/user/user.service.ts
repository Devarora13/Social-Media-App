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
    if (currentUserId === targetUserId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const currentUser = await this.userModel.findById(currentUserId);
    const targetUser = await this.userModel.findById(targetUserId);

    if (!currentUser || !targetUser) {
      throw new NotFoundException('User not found');
    }

    if (currentUser.following.includes(targetUserId)) {
      throw new BadRequestException('Already following this user');
    }

    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);

    await currentUser.save();
    await targetUser.save();

    this.notificationsGateway.sendNotification(
      targetUserId,
      `${currentUser.username} started following you`
    );

    return { message: 'Followed successfully' };
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
