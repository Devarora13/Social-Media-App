import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsProcessor } from './posts.processor';
import { Post, PostSchema } from './schemas/post.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { UserModule } from '../user/user.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
    ]),
    BullModule.registerQueue({
      name: 'post-processing',
    }),
    forwardRef(() => UserModule),
    forwardRef(() => NotificationsModule),
    forwardRef(() => AuthModule), // Import AuthModule for JWT functionality
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsProcessor],
  exports: [PostsService],
})
export class PostsModule {}
