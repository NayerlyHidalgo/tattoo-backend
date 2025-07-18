import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { FilterNotificationsDto } from './dto/filter-notifications.dto';
import { BulkUpdateNotificationsDto, MarkAsReadDto } from './dto/bulk-notifications.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { ApiResponse } from '../types/api-response.interface';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createNotificationDto: CreateNotificationDto): Promise<ApiResponse<any>> {
    try {
      const notification = await this.notificationsService.create(createNotificationDto);
      return {
        success: true,
        message: 'Notification created successfully',
        data: notification,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.message,
      };
    }
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(@Query() filterDto: FilterNotificationsDto): Promise<ApiResponse<any>> {
    try {
      const result = await this.notificationsService.findAll(filterDto);
      return {
        success: true,
        message: 'Notifications retrieved successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve notifications',
        error: error.message,
      };
    }
  }

  @Get('my-notifications')
  async getMyNotifications(@Request() req, @Query() filterDto: FilterNotificationsDto): Promise<ApiResponse<any>> {
    try {
      const userId = req.user.sub;
      const notifications = await this.notificationsService.findByUser(userId, filterDto);
      return {
        success: true,
        message: 'User notifications retrieved successfully',
        data: notifications,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve user notifications',
        error: error.message,
      };
    }
  }

  @Get('unread')
  async getUnreadNotifications(@Request() req): Promise<ApiResponse<any>> {
    try {
      const userId = req.user.sub;
      const notifications = await this.notificationsService.findUnreadByUser(userId);
      return {
        success: true,
        message: 'Unread notifications retrieved successfully',
        data: notifications,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve unread notifications',
        error: error.message,
      };
    }
  }

  @Get('statistics')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getStatistics(@Query('userId') userId?: string): Promise<ApiResponse<any>> {
    try {
      const stats = await this.notificationsService.getStatistics(userId);
      return {
        success: true,
        message: 'Notification statistics retrieved successfully',
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve notification statistics',
        error: error.message,
      };
    }
  }

  @Get('user-statistics')
  async getUserStatistics(@Request() req): Promise<ApiResponse<any>> {
    try {
      const userId = req.user.sub;
      const stats = await this.notificationsService.getStatistics(userId);
      return {
        success: true,
        message: 'User notification statistics retrieved successfully',
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve user notification statistics',
        error: error.message,
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req): Promise<ApiResponse<any>> {
    try {
      const notification = await this.notificationsService.findOne(id);
      
      // Verificar que el usuario solo pueda ver sus propias notificaciones (excepto admin)
      if (req.user.role !== UserRole.ADMIN && notification.userId !== req.user.sub) {
        return {
          success: false,
          message: 'Access denied to this notification',
        };
      }

      return {
        success: true,
        message: 'Notification retrieved successfully',
        data: notification,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve notification',
        error: error.message,
      };
    }
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<ApiResponse<any>> {
    try {
      const notification = await this.notificationsService.update(id, updateNotificationDto);
      return {
        success: true,
        message: 'Notification updated successfully',
        data: notification,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update notification',
        error: error.message,
      };
    }
  }

  @Patch(':id/mark-read')
  async markAsRead(@Param('id') id: string, @Request() req): Promise<ApiResponse<any>> {
    try {
      // Verificar que el usuario solo pueda marcar sus propias notificaciones
      const notification = await this.notificationsService.findOne(id);
      if (req.user.role !== UserRole.ADMIN && notification.userId !== req.user.sub) {
        return {
          success: false,
          message: 'Access denied to this notification',
        };
      }

      const updatedNotification = await this.notificationsService.markAsRead(id);
      return {
        success: true,
        message: 'Notification marked as read',
        data: updatedNotification,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to mark notification as read',
        error: error.message,
      };
    }
  }

  @Patch('bulk/mark-read')
  async bulkMarkAsRead(@Body() markAsReadDto: MarkAsReadDto, @Request() req): Promise<ApiResponse<any>> {
    try {
      // Para usuarios normales, verificar que solo marquen sus propias notificaciones
      if (req.user.role !== UserRole.ADMIN) {
        const notifications = await Promise.all(
          markAsReadDto.notificationIds.map(id => this.notificationsService.findOne(id))
        );
        
        const hasUnauthorized = notifications.some(notif => notif.userId !== req.user.sub);
        if (hasUnauthorized) {
          return {
            success: false,
            message: 'Access denied to some notifications',
          };
        }
      }

      const result = await this.notificationsService.bulkMarkAsRead(markAsReadDto);
      return {
        success: true,
        message: `${result.modifiedCount} notifications marked as read`,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to mark notifications as read',
        error: error.message,
      };
    }
  }

  @Delete('bulk')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async bulkDelete(@Body() bulkUpdateDto: BulkUpdateNotificationsDto): Promise<ApiResponse<any>> {
    try {
      const result = await this.notificationsService.bulkDelete(bulkUpdateDto);
      return {
        success: true,
        message: `${result.deletedCount} notifications deleted successfully`,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete notifications',
        error: error.message,
      };
    }
  }

  @Delete('cleanup/:days')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async deleteOldNotifications(@Param('days') days: string): Promise<ApiResponse<any>> {
    try {
      const daysOld = parseInt(days, 10);
      if (isNaN(daysOld) || daysOld < 1) {
        return {
          success: false,
          message: 'Invalid number of days provided',
        };
      }

      const result = await this.notificationsService.deleteOldNotifications(daysOld);
      return {
        success: true,
        message: `${result.deletedCount} old notifications deleted successfully`,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete old notifications',
        error: error.message,
      };
    }
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.notificationsService.remove(id);
  }
}
