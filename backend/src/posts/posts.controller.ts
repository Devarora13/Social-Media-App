import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 requests per minute for posts
  async createPost(@Request() req, @Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(req.user.userId, createPostDto);
  }

  @Get('timeline')
  async getTimeline(@Request() req) {
    return this.postsService.getTimeline(req.user.userId);
  }

  @Get('all')
  async getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get('user/:userId')
  async getPostsByUser(@Param('userId') userId: string) {
    return this.postsService.getPostsByUser(userId);
  }
}
