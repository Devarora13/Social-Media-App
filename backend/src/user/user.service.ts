import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

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

  // Follow a user
  async followUser(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) return null;

    await this.userModel.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: currentUserId },
    });

    await this.userModel.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: targetUserId },
    });

    return { message: 'Followed successfully' };
  }

  // Unfollow a user
  async unfollowUser(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) return null;

    await this.userModel.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUserId },
    });

    await this.userModel.findByIdAndUpdate(currentUserId, {
      $pull: { following: targetUserId },
    });

    return { message: 'Unfollowed successfully' };
  }
}
