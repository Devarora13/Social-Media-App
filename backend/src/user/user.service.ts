import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createUser(data: Partial<User>): Promise<UserDocument> {
    const user = new this.userModel(data);
    return user.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async findByUsername(username: string): Promise<any> {
    const user = await this.userModel.findOne({ username }).select('-password');
    if (!user) return null;
    
    // Transform _id to id for frontend compatibility
    const userObject = user.toObject();
    return {
      ...userObject,
      id: (userObject as any)._id.toString(),
      _id: undefined // Remove _id field
    };
  }

  async findById(id: string): Promise<any> {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) return null;
    
    // Transform _id to id for frontend compatibility
    const userObject = user.toObject();
    return {
      ...userObject,
      id: (userObject as any)._id.toString(),
      _id: undefined // Remove _id field
    };
  }

  async findAll(): Promise<any[]> {
    const users = await this.userModel.find().select('-password'); // Exclude password field
    
    // Transform _id to id for frontend compatibility
    return users.map(user => {
      const userObject = user.toObject();
      return {
        ...userObject,
        id: (userObject as any)._id.toString(),
        _id: undefined // Remove _id field
      };
    });
  }

  async findByIds(ids: string[]): Promise<any[]> {
    const users = await this.userModel.find({ _id: { $in: ids } }).select('-password');
    
    // Transform _id to id for frontend compatibility
    return users.map(user => {
      const userObject = user.toObject();
      return {
        ...userObject,
        id: (userObject as any)._id.toString(),
        _id: undefined // Remove _id field
      };
    });
  }

  async followUser(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw new Error('You cannot follow yourself');
    }

    const currentUser = await this.userModel.findById(currentUserId);
    const targetUser = await this.userModel.findById(targetUserId);

    if (!currentUser || !targetUser) {
      throw new NotFoundException('User not found');
    }

    if (!currentUser.following.includes(targetUserId)) {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);

      await currentUser.save();
      await targetUser.save();

      // Send real-time notification
      this.notificationsService.sendNotification(targetUserId, {
        type: 'follow',
        message: `${currentUser.username} followed you`,
        fromUserId: currentUserId,
      });
    }

    return { message: 'Followed successfully' };
  }

  async unfollowUser(currentUserId: string, targetUserId: string) {
    const currentUser = await this.userModel.findById(currentUserId);
    const targetUser = await this.userModel.findById(targetUserId);

    if (!currentUser || !targetUser) {
      throw new NotFoundException('User not found');
    }

    currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);

    await currentUser.save();
    await targetUser.save();

    return { message: 'Unfollowed successfully' };
  }
}
