import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument, NotificationStatus } from './schemas/notifications.schemas';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { FilterNotificationsDto } from './dto/filter-notifications.dto';
import { BulkUpdateNotificationsDto, MarkAsReadDto } from './dto/bulk-notifications.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    // Validar que al menos userId o userEmail esté presente
    if (!createNotificationDto.userId && !createNotificationDto.userEmail) {
      throw new BadRequestException('Either userId or userEmail must be provided');
    }

    const notification = new this.notificationModel(createNotificationDto);
    return notification.save();
  }

  async findAll(filterDto: FilterNotificationsDto): Promise<{
    notifications: Notification[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      userId,
      userEmail,
      status,
      type,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filterDto;

    // Construir query de filtros
    const query: any = {};

    if (userId) query.userId = userId;
    if (userEmail) query.userEmail = userEmail;
    if (status) query.status = status;
    if (type) query.type = type;

    // Filtro por fechas
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Calcular skip para paginación
    const skip = (page - 1) * limit;

    // Ejecutar consultas en paralelo
    const [notifications, total] = await Promise.all([
      this.notificationModel
        .find(query)
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.notificationModel.countDocuments(query).exec(),
    ]);

    return {
      notifications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationModel.findById(id).exec();
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return notification;
  }

  async findByUser(userId: string, filters?: Partial<FilterNotificationsDto>): Promise<Notification[]> {
    const query = { userId, ...filters };
    return this.notificationModel
      .find(query)
      .sort({ createdAt: -1 })
      .exec();
  }

  async findUnreadByUser(userId: string): Promise<Notification[]> {
    return this.notificationModel
      .find({ 
        userId, 
        status: { $in: [NotificationStatus.PENDING, NotificationStatus.SENT] }
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    const notification = await this.notificationModel
      .findByIdAndUpdate(id, updateNotificationDto, { new: true })
      .exec();
    
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    
    return notification;
  }

  async markAsRead(id: string): Promise<Notification> {
    return this.update(id, { 
      status: NotificationStatus.READ, 
      readAt: new Date() 
    });
  }

  async markAsSent(id: string): Promise<Notification> {
    return this.update(id, { 
      status: NotificationStatus.SENT, 
      sentAt: new Date() 
    });
  }

  async markAsFailed(id: string): Promise<Notification> {
    return this.update(id, { 
      status: NotificationStatus.FAILED 
    });
  }

  async bulkMarkAsRead(markAsReadDto: MarkAsReadDto): Promise<{ modifiedCount: number }> {
    const result = await this.notificationModel
      .updateMany(
        { _id: { $in: markAsReadDto.notificationIds } },
        { 
          status: NotificationStatus.READ, 
          readAt: new Date() 
        }
      )
      .exec();

    return { modifiedCount: result.modifiedCount };
  }

  async bulkDelete(bulkUpdateDto: BulkUpdateNotificationsDto): Promise<{ deletedCount: number }> {
    const result = await this.notificationModel
      .deleteMany({ _id: { $in: bulkUpdateDto.notificationIds } })
      .exec();

    return { deletedCount: result.deletedCount };
  }

  async remove(id: string): Promise<void> {
    const result = await this.notificationModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
  }

  async getStatistics(userId?: string): Promise<{
    total: number;
    pending: number;
    sent: number;
    read: number;
    failed: number;
    byType: Record<string, number>;
  }> {
    const matchStage = userId ? { userId } : {};

    const stats = await this.notificationModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', NotificationStatus.PENDING] }, 1, 0] }
          },
          sent: {
            $sum: { $cond: [{ $eq: ['$status', NotificationStatus.SENT] }, 1, 0] }
          },
          read: {
            $sum: { $cond: [{ $eq: ['$status', NotificationStatus.READ] }, 1, 0] }
          },
          failed: {
            $sum: { $cond: [{ $eq: ['$status', NotificationStatus.FAILED] }, 1, 0] }
          }
        }
      }
    ]);

    const typeStats = await this.notificationModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const byType = typeStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    return {
      total: stats[0]?.total || 0,
      pending: stats[0]?.pending || 0,
      sent: stats[0]?.sent || 0,
      read: stats[0]?.read || 0,
      failed: stats[0]?.failed || 0,
      byType
    };
  }

  async deleteOldNotifications(daysOld: number = 30): Promise<{ deletedCount: number }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await this.notificationModel
      .deleteMany({
        createdAt: { $lt: cutoffDate },
        status: { $in: [NotificationStatus.READ, NotificationStatus.FAILED] }
      })
      .exec();

    return { deletedCount: result.deletedCount };
  }
}
