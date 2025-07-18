import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LogsService } from './logs/logs.service';
import { CreateLogDto } from './logs/dto/create-log.dto';
import { LogAction, EntityType } from './logs/log.entity';

async function seedPostgreSQLLogs() {
  const app = await NestFactory.create(AppModule);
  
  try {
    const logsService = app.get(LogsService);

    console.log('🌱 Starting PostgreSQL Logs seeding...');

    // Crear logs de ejemplo
    const logs: CreateLogDto[] = [
      {
        action: LogAction.LOGIN,
        userId: 'admin_001',
        entityType: EntityType.USER,
        entityId: 'admin_001',
        details: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          ip: '192.168.1.50',
          loginMethod: 'jwt',
          description: 'Administrador inició sesión en el sistema'
        },
        ipAddress: '192.168.1.50',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      {
        action: LogAction.CREATE,
        userId: 'user_002',
        entityType: EntityType.ORDER,
        entityId: 'order_001',
        details: {
          orderNumber: 'TT-2024-001',
          items: ['Diseño de dragón personalizado'],
          total: 350.00,
          artistId: 'artist_001',
          description: 'Usuario creó una nueva orden'
        },
        ipAddress: '192.168.1.101'
      },
      {
        action: LogAction.UPDATE,
        userId: 'admin_001',
        entityType: EntityType.ORDER,
        entityId: 'order_001',
        details: {
          previousStatus: 'pending',
          newStatus: 'confirmed',
          updatedBy: 'admin_001',
          description: 'Estado de orden actualizado a confirmado'
        },
        ipAddress: '192.168.1.50'
      },
      {
        action: LogAction.CREATE,
        userId: 'user_003',
        entityType: EntityType.REVIEW,
        entityId: 'review_001',
        details: {
          productId: 'prod_dragon_001',
          rating: 5,
          comment: 'Excelente diseño, muy profesional',
          description: 'Usuario creó una nueva reseña'
        },
        ipAddress: '192.168.1.102'
      },
      {
        action: LogAction.DELETE,
        userId: 'admin_001',
        entityType: EntityType.PRODUCT,
        entityId: 'prod_old_001',
        details: {
          reason: 'Producto descontinuado',
          deletedBy: 'admin_001',
          description: 'Producto eliminado por administrador'
        },
        ipAddress: '192.168.1.50'
      },
      {
        action: LogAction.VIEW,
        userId: 'user_004',
        entityType: EntityType.PRODUCT,
        entityId: 'prod_dragon_001',
        details: {
          viewDuration: '00:02:45',
          source: 'search',
          category: 'asian',
          description: 'Usuario visualizó producto'
        },
        ipAddress: '192.168.1.103'
      },
      {
        action: LogAction.APPROVE,
        userId: 'admin_001',
        entityType: EntityType.REVIEW,
        entityId: 'review_001',
        details: {
          approvedBy: 'admin_001',
          moderationNotes: 'Reseña apropiada y constructiva',
          description: 'Reseña aprobada por moderador'
        },
        ipAddress: '192.168.1.50'
      },
      {
        action: LogAction.ERROR,
        userId: 'user_005',
        entityType: EntityType.ORDER,
        entityId: 'order_002',
        details: {
          errorCode: 'PAYMENT_FAILED',
          errorMessage: 'Tarjeta de crédito declinada',
          attemptNumber: 2,
          description: 'Error en procesamiento de pago'
        },
        errorMessage: 'Tarjeta de crédito declinada',
        statusCode: 400,
        ipAddress: '192.168.1.104'
      },
      {
        action: LogAction.EXPORT,
        userId: 'admin_001',
        entityType: EntityType.ORDER,
        details: {
          exportType: 'monthly_report',
          dateRange: '2024-07-01 to 2024-07-31',
          recordCount: 125,
          description: 'Administrador exportó reporte mensual'
        },
        ipAddress: '192.168.1.50'
      },
      {
        action: LogAction.LOGOUT,
        userId: 'admin_001',
        entityType: EntityType.USER,
        entityId: 'admin_001',
        details: {
          sessionDuration: '02:30:45',
          actionsPerformed: 15,
          description: 'Administrador cerró sesión'
        },
        ipAddress: '192.168.1.50'
      }
    ];

    console.log('📝 Creating logs...');
    for (const log of logs) {
      const createdLog = await logsService.create(log);
      console.log(`✅ Created log: ${log.action} for ${log.entityType} (ID: ${createdLog.id})`);
    }

    // Obtener estadísticas
    const stats = await logsService.getStats();
    console.log('\n📊 Log Statistics:');
    console.log(JSON.stringify(stats, null, 2));
    
  } catch (error) {
    console.error('❌ Error seeding PostgreSQL logs:', error);
  } finally {
    await app.close();
    process.exit(0);
  }
}

// Ejecutar el seeding
seedPostgreSQLLogs().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
