import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  READ = 'read'
}

export enum NotificationType {
  ORDER_CONFIRMATION = 'order_confirmation',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  PRODUCT_ALERT = 'product_alert',
  SYSTEM_ALERT = 'system_alert',
  WELCOME = 'welcome'
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true, enum: NotificationType })
  type: NotificationType;

  @Prop({ required: true, enum: NotificationStatus, default: NotificationStatus.PENDING })
  status: NotificationStatus;

  @Prop()
  userId?: string;

  @Prop()
  userEmail?: string;

  @Prop()
  orderNumber?: string;

  @Prop()
  productId?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop()
  sentAt?: Date;

  @Prop()
  readAt?: Date;

  @Prop({ default: new Date() })
  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
