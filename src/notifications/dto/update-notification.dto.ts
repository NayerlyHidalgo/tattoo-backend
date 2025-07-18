import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { CreateNotificationDto } from './create-notification.dto';
import { NotificationStatus } from '../schemas/notifications.schemas';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;

  @IsOptional()
  @IsDateString()
  sentAt?: Date;

  @IsOptional()
  @IsDateString()
  readAt?: Date;
}
