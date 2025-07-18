import { Injectable } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationType } from './schemas/notifications.schemas';

@Injectable()
export class NotificationHelperService {
  constructor(private readonly notificationsService: NotificationsService) {}

  async sendWelcomeNotification(userId: string, userEmail: string, userName: string): Promise<void> {
    await this.notificationsService.create({
      title: '¡Bienvenido a nuestra plataforma!',
      message: `Hola ${userName}, gracias por registrarte. Explora nuestros productos y servicios.`,
      type: NotificationType.WELCOME,
      userId,
      userEmail,
      metadata: {
        userName,
        registrationDate: new Date(),
      },
    });
  }

  async sendOrderConfirmationNotification(
    userId: string,
    userEmail: string,
    orderNumber: string,
    orderTotal: number,
  ): Promise<void> {
    await this.notificationsService.create({
      title: 'Orden Confirmada',
      message: `Tu orden #${orderNumber} ha sido confirmada por un total de $${orderTotal.toFixed(2)}.`,
      type: NotificationType.ORDER_CONFIRMATION,
      userId,
      userEmail,
      orderNumber,
      metadata: {
        orderTotal,
        confirmationDate: new Date(),
      },
    });
  }

  async sendPaymentSuccessNotification(
    userId: string,
    userEmail: string,
    orderNumber: string,
    amount: number,
    paymentMethod: string,
  ): Promise<void> {
    await this.notificationsService.create({
      title: 'Pago Procesado Exitosamente',
      message: `Tu pago de $${amount.toFixed(2)} para la orden #${orderNumber} ha sido procesado correctamente.`,
      type: NotificationType.PAYMENT_SUCCESS,
      userId,
      userEmail,
      orderNumber,
      metadata: {
        amount,
        paymentMethod,
        processedAt: new Date(),
      },
    });
  }

  async sendPaymentFailedNotification(
    userId: string,
    userEmail: string,
    orderNumber: string,
    amount: number,
    errorReason?: string,
  ): Promise<void> {
    await this.notificationsService.create({
      title: 'Error en el Pago',
      message: `No pudimos procesar tu pago de $${amount.toFixed(2)} para la orden #${orderNumber}. Por favor, intenta nuevamente.`,
      type: NotificationType.PAYMENT_FAILED,
      userId,
      userEmail,
      orderNumber,
      metadata: {
        amount,
        errorReason,
        failedAt: new Date(),
      },
    });
  }

  async sendProductAlertNotification(
    userId: string,
    userEmail: string,
    productId: string,
    productName: string,
    alertType: 'back_in_stock' | 'price_drop' | 'low_stock',
    additionalInfo?: any,
  ): Promise<void> {
    let title = '';
    let message = '';

    switch (alertType) {
      case 'back_in_stock':
        title = '¡Producto Disponible!';
        message = `El producto "${productName}" que tenías en tu lista de deseos ya está disponible.`;
        break;
      case 'price_drop':
        title = '¡Precio Reducido!';
        message = `El producto "${productName}" ha bajado de precio. ¡No te lo pierdas!`;
        break;
      case 'low_stock':
        title = 'Stock Limitado';
        message = `Quedan pocas unidades del producto "${productName}". ¡Apúrate!`;
        break;
    }

    await this.notificationsService.create({
      title,
      message,
      type: NotificationType.PRODUCT_ALERT,
      userId,
      userEmail,
      productId,
      metadata: {
        productName,
        alertType,
        ...additionalInfo,
        alertDate: new Date(),
      },
    });
  }

  async sendSystemAlertNotification(
    title: string,
    message: string,
    targetUsers?: string[],
    metadata?: Record<string, any>,
  ): Promise<void> {
    if (targetUsers && targetUsers.length > 0) {
      // Enviar a usuarios específicos
      const notifications = targetUsers.map(userId =>
        this.notificationsService.create({
          title,
          message,
          type: NotificationType.SYSTEM_ALERT,
          userId,
          metadata: {
            ...metadata,
            alertDate: new Date(),
          },
        }),
      );
      await Promise.all(notifications);
    } else {
      // Enviar notificación general (sin userId específico)
      await this.notificationsService.create({
        title,
        message,
        type: NotificationType.SYSTEM_ALERT,
        metadata: {
          ...metadata,
          alertDate: new Date(),
          isGlobalAlert: true,
        },
      });
    }
  }

  async sendBulkNotifications(
    notifications: Array<{
      userId?: string;
      userEmail?: string;
      title: string;
      message: string;
      type: NotificationType;
      metadata?: Record<string, any>;
    }>,
  ): Promise<void> {
    const promises = notifications.map(notif =>
      this.notificationsService.create(notif),
    );
    await Promise.all(promises);
  }
}
