// Exportar servicios principales
export { NotificationsService } from './notifications.service';
export { NotificationHelperService } from './notification-helper.service';

// Exportar schemas y tipos
export { 
  Notification, 
  NotificationDocument, 
  NotificationSchema,
  NotificationStatus,
  NotificationType 
} from './schemas/notifications.schemas';

// Exportar DTOs
export { CreateNotificationDto } from './dto/create-notification.dto';
export { UpdateNotificationDto } from './dto/update-notification.dto';
export { FilterNotificationsDto } from './dto/filter-notifications.dto';
export { BulkUpdateNotificationsDto, MarkAsReadDto } from './dto/bulk-notifications.dto';

// Exportar módulo
export { NotificationsModule } from './notifications.module';
