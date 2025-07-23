import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Model } from 'mongoose';
import { Queue } from 'bull';
import { Post, PostDocument } from './schemas/post.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectQueue('post-processing') private postQueue: Queue,
    private notificationsService: NotificationsService,
  ) {}

  async createPost(userId: string, createPostDto: CreatePostDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // Add job to queue with 5-second delay
    const job = await this.postQueue.add(
      'create-post',
      {
        userId,
        username: user.username,
        postData: createPostDto,
      },
      {
        delay: 5000, // 5-second delay as required
      }
    );

    return {
      message: 'Post creation queued successfully',
      jobId: job.id,
    };
  }

  async processPostCreation(jobData: {
    userId: string;
    username: string;
    postData: CreatePostDto;
  }) {
    const { userId, username, postData } = jobData;

    // Create the post in database after delay
    const post = await this.postModel.create({
      ...postData,
      authorId: userId,
      authorUsername: username,
    });

    // Get user's followers
    const user = await this.userModel.findById(userId).populate('followers');
    
    // Send WebSocket notification to all followers
    if (user && user.followers.length > 0) {
      for (const followerId of user.followers) {
        await this.notificationsService.sendNotification(followerId.toString(), {
          type: 'post',
          message: `${username} created a new post: "${postData.title}"`,
          fromUserId: userId,
          postId: (post as any)._id.toString(),
        });
      }
    }

    return post;
  }

  async getTimeline(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get posts from users that current user follows
    const posts = await this.postModel
      .find({
        authorId: { $in: user.following },
      })
      .sort({ createdAt: -1 }) // Newest first
      .populate('authorId', 'username')
      .exec();

    return posts;
  }

  async getAllPosts() {
    return this.postModel
      .find()
      .sort({ createdAt: -1 })
      .populate('authorId', 'username')
      .exec();
  }

  async getPostsByUser(userId: string) {
    return this.postModel
      .find({ authorId: userId })
      .sort({ createdAt: -1 })
      .exec();
  }
}
