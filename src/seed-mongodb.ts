import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NotificationsService } from './notifications/notifications.service';
import { CreateNotificationDto } from './notifications/dto/create-notification.dto';
import { NotificationType } from './notifications/schemas/notifications.schemas';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

async function seedMongoDB() {
  const app = await NestFactory.create(AppModule);
  
  try {
    const notificationsService = app.get(NotificationsService);
    const mongoConnection = app.get(getConnectionToken());

    console.log('🌱 Starting MongoDB seeding...');

    // Limpiar datos existentes
    await mongoConnection.db.collection('notifications').deleteMany({});
    console.log('🧹 Cleared existing notifications');

    // Crear datos de notificaciones
    const notifications: CreateNotificationDto[] = [
      {
        title: 'Bienvenido a Tattoo Shop',
        message: 'Gracias por registrarte en nuestra plataforma de tatuajes. ¡Explora nuestros increíbles diseños!',
        type: NotificationType.WELCOME,
        userId: 'user_001',
        userEmail: 'usuario1@example.com',
        metadata: {
          source: 'registration',
          timestamp: new Date().toISOString()
        }
      },
      {
        title: 'Pedido Confirmado #TT-2024-001',
        message: 'Tu pedido ha sido confirmado exitosamente. El artista comenzará a trabajar en tu diseño personalizado.',
        type: NotificationType.ORDER_CONFIRMATION,
        userId: 'user_002',
        userEmail: 'cliente@example.com',
        orderNumber: 'TT-2024-001',
        metadata: {
          orderValue: 350.00,
          artistId: 'artist_001',
          estimatedCompletion: '2024-08-15'
        }
      },
      {
        title: 'Pago Procesado Exitosamente',
        message: 'Tu pago de $350.00 ha sido procesado correctamente. Recibirás tu diseño en 3-5 días hábiles.',
        type: NotificationType.PAYMENT_SUCCESS,
        userId: 'user_002',
        userEmail: 'cliente@example.com',
        orderNumber: 'TT-2024-001',
        metadata: {
          amount: 350.00,
          paymentMethod: 'credit_card',
          transactionId: 'tx_abc123'
        }
      },
      {
        title: 'Nuevo Diseño Disponible',
        message: 'Tenemos un nuevo diseño de dragón japonés que podría interesarte. ¡Échale un vistazo!',
        type: NotificationType.PRODUCT_ALERT,
        userId: 'user_003',
        userEmail: 'fan.tatuajes@example.com',
        productId: 'prod_dragon_001',
        metadata: {
          category: 'asian',
          style: 'japanese',
          artist: 'Kenji Nakamura'
        }
      },
      {
        title: 'Error en el Procesamiento de Pago',
        message: 'Hubo un problema al procesar tu pago. Por favor, verifica la información de tu tarjeta.',
        type: NotificationType.PAYMENT_FAILED,
        userId: 'user_004',
        userEmail: 'problema@example.com',
        orderNumber: 'TT-2024-002',
        metadata: {
          errorCode: 'CARD_DECLINED',
          attemptNumber: 2,
          suggestedAction: 'contact_bank'
        }
      },
      {
        title: 'Mantenimiento Programado',
        message: 'El sistema estará en mantenimiento el domingo de 2:00 AM a 6:00 AM. Disculpe las molestias.',
        type: NotificationType.SYSTEM_ALERT,
        userEmail: 'admin@tattooshop.com',
        metadata: {
          maintenanceType: 'scheduled',
          startTime: '2024-07-21T02:00:00Z',
          endTime: '2024-07-21T06:00:00Z'
        }
      }
    ];

    console.log('📧 Creating notifications...');
    for (const notification of notifications) {
      await notificationsService.create(notification);
      console.log(`✅ Created notification: ${notification.title}`);
    }

    // Crear una segunda colección: configuraciones del sistema
    console.log('⚙️ Creating system configurations...');
    
    const systemConfigs = [
      {
        key: 'app_settings',
        name: 'Configuración de la Aplicación',
        data: {
          maintenanceMode: false,
          allowRegistrations: true,
          maxOrdersPerDay: 50,
          supportEmail: 'support@tattooshop.com',
          businessHours: {
            monday: '9:00-18:00',
            tuesday: '9:00-18:00',
            wednesday: '9:00-18:00',
            thursday: '9:00-18:00',
            friday: '9:00-18:00',
            saturday: '10:00-16:00',
            sunday: 'closed'
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'payment_settings',
        name: 'Configuración de Pagos',
        data: {
          acceptedCurrencies: ['USD', 'EUR', 'MXN'],
          minimumOrder: 50.00,
          maximumOrder: 2000.00,
          taxRate: 0.16,
          processingFee: 2.9,
          enabledMethods: ['credit_card', 'paypal', 'bank_transfer']
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'notification_settings',
        name: 'Configuración de Notificaciones',
        data: {
          emailEnabled: true,
          smsEnabled: false,
          pushEnabled: true,
          templates: {
            welcome: 'welcome_template_v2',
            orderConfirmation: 'order_confirmation_v3',
            paymentSuccess: 'payment_success_v1'
          },
          retryAttempts: 3,
          retryInterval: 300
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await mongoConnection.db.collection('systemconfigs').deleteMany({});
    await mongoConnection.db.collection('systemconfigs').insertMany(systemConfigs);
    console.log('⚙️ Created system configurations');

    // Crear una tercera colección: logs de actividad
    console.log('📊 Creating activity logs...');
    
    const activityLogs = [
      {
        action: 'user_registration',
        userId: 'user_001',
        details: {
          email: 'usuario1@example.com',
          registrationMethod: 'email',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timestamp: new Date(Date.now() - 86400000), // 1 día atrás
        ip: '192.168.1.100'
      },
      {
        action: 'order_created',
        userId: 'user_002',
        orderId: 'TT-2024-001',
        details: {
          items: ['Diseño de dragón personalizado'],
          total: 350.00,
          artistId: 'artist_001'
        },
        timestamp: new Date(Date.now() - 43200000), // 12 horas atrás
        ip: '192.168.1.101'
      },
      {
        action: 'payment_processed',
        userId: 'user_002',
        orderId: 'TT-2024-001',
        details: {
          amount: 350.00,
          method: 'credit_card',
          status: 'success'
        },
        timestamp: new Date(Date.now() - 21600000), // 6 horas atrás
        ip: '192.168.1.101'
      },
      {
        action: 'admin_login',
        userId: 'admin_001',
        details: {
          loginMethod: 'jwt',
          role: 'admin',
          lastLogin: new Date(Date.now() - 7200000)
        },
        timestamp: new Date(Date.now() - 3600000), // 1 hora atrás
        ip: '192.168.1.50'
      }
    ];

    await mongoConnection.db.collection('activitylogs').deleteMany({});
    await mongoConnection.db.collection('activitylogs').insertMany(activityLogs);
    console.log('📊 Created activity logs');

    // Mostrar estadísticas finales
    const notificationCount = await mongoConnection.db.collection('notifications').countDocuments();
    const configCount = await mongoConnection.db.collection('systemconfigs').countDocuments();
    const logCount = await mongoConnection.db.collection('activitylogs').countDocuments();

    console.log('\n🎉 MongoDB seeding completed successfully!');
    console.log('📈 Statistics:');
    console.log(`   📧 Notifications: ${notificationCount} documents`);
    console.log(`   ⚙️  System Configs: ${configCount} documents`);
    console.log(`   📊 Activity Logs: ${logCount} documents`);
    console.log(`   📚 Total Collections: 3`);
    console.log('\n🔗 Database: tattoo-shop (MongoDB Atlas)');
    
  } catch (error) {
    console.error('❌ Error seeding MongoDB:', error);
  } finally {
    await app.close();
    process.exit(0);
  }
}

// Ejecutar el seeding
seedMongoDB().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
