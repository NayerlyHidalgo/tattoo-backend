import { IsString, IsEnum, IsOptional, IsEmail, IsObject } from 'class-validator';
import { NotificationType } from '../schemas/notifications.schemas';

export class CreateNotificationDto {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEmail()
  userEmail?: string;

  @IsOptional()
  @IsString()
  orderNumber?: string;

  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
