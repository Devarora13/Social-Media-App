import { Controller, Post, Delete, Param, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  async follow(@Param('id') targetUserId: string, @Req() req: Request) {
    const currentUserId = req.user?.userId;
    if (!currentUserId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.userService.followUser(currentUserId, targetUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/unfollow')
  async unfollow(@Param('id') targetUserId: string, @Req() req: Request) {
    const currentUserId = req.user?.userId;
    if (!currentUserId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.userService.unfollowUser(currentUserId, targetUserId);
  }
}
