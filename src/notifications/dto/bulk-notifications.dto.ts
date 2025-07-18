import { IsArray, IsString } from 'class-validator';

export class BulkUpdateNotificationsDto {
  @IsArray()
  @IsString({ each: true })
  notificationIds: string[];
}

export class MarkAsReadDto {
  @IsArray()
  @IsString({ each: true })
  notificationIds: string[];
}
