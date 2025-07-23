import { Controller, Post, Delete, Param, Req, UseGuards, UnauthorizedException, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('user') // Changed from 'users' to 'user' to match frontend
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get current user profile
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const currentUserId = req.user?.userId;
    if (!currentUserId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.userService.findById(currentUserId);
  }

  // Get all users (for search/discovery)
  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAllUsers() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('follow/:userId') // Updated path to match frontend
  async follow(@Param('userId') targetUserId: string, @Req() req: Request) {
    const currentUserId = req.user?.userId;
    if (!currentUserId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.userService.followUser(currentUserId, targetUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('unfollow/:userId') // Changed to POST to match frontend expectations
  async unfollow(@Param('userId') targetUserId: string, @Req() req: Request) {
    const currentUserId = req.user?.userId;
    if (!currentUserId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.userService.unfollowUser(currentUserId, targetUserId);
  }
}
