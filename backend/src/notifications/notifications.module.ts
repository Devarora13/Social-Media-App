import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_super_secret',
    }),
  ],
  providers: [NotificationsGateway, NotificationsService],
  exports: [NotificationsService], // Only exporting NotificationsService (not the gateway directly)
})
export class NotificationsModule {}
