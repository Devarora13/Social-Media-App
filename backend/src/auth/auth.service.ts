import { Injectable, UnauthorizedException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.userService.createUser({
      ...registerDto,
      password: hashedPassword,
    });
    
    const userId = (user as any)._id.toString();
    const access_token = this.jwtService.sign({ userId });
    
    return {
      access_token,
      user: {
        id: userId,
        email: user.email,
        username: user.username,
        followers: user.followers || [],
        following: user.following || [],
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const userId = (user as any)._id.toString();
    const access_token = this.jwtService.sign({ userId });
    
    return {
      access_token,
      user: {
        id: userId,
        email: user.email,
        username: user.username,
        followers: user.followers || [],
        following: user.following || [],
      },
    };
  }
}
