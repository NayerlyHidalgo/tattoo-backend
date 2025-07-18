import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationHelperService } from './notification-helper.service';
import { Notification, NotificationSchema } from './schemas/notifications.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema }
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationHelperService],
  exports: [NotificationsService, NotificationHelperService], // Para poder usar los services en otros módulos
})
export class NotificationsModule {}
