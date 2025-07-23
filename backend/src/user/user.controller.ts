import { Controller, Param, Post, UseGuards, Req, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UserController {
  constructor(private userService: UserService, private jwt: JwtService) {}

  private getUserIdFromRequest(req: any): string {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = this.jwt.decode(token) as any;
    return decoded?.userId;
  }

  @Post(':id/follow')
  async follow(@Param('id') targetUserId: string, @Req() req) {
    const currentUserId = this.getUserIdFromRequest(req);
    return this.userService.followUser(currentUserId, targetUserId);
  }

  @Delete(':id/unfollow')
  async unfollow(@Param('id') targetUserId: string, @Req() req) {
    const currentUserId = this.getUserIdFromRequest(req);
    return this.userService.unfollowUser(currentUserId, targetUserId);
  }
}
