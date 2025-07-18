# Notifications Module

Este módulo maneja el sistema completo de notificaciones de la aplicación, permitiendo enviar y gestionar notificaciones a los usuarios.

## Características

- ✅ CRUD completo de notificaciones
- ✅ Sistema de estados (pending, sent, failed, read)
- ✅ Diferentes tipos de notificaciones (welcome, order confirmation, payment, alerts)
- ✅ Filtrado y paginación avanzada
- ✅ Operaciones en lote (bulk operations)
- ✅ Estadísticas y métricas
- ✅ Limpieza automática de notificaciones antiguas
- ✅ Helper service para facilitar el envío
- ✅ Seguridad por roles y permisos

## Estructura

```
notifications/
├── dto/
│   ├── create-notification.dto.ts      # DTO para crear notificaciones
│   ├── update-notification.dto.ts      # DTO para actualizar notificaciones
│   ├── filter-notifications.dto.ts     # DTO para filtrar con paginación
│   └── bulk-notifications.dto.ts       # DTOs para operaciones en lote
├── schemas/
│   └── notifications.schemas.ts        # Schema de Mongoose para notificaciones
├── notifications.controller.ts         # Controlador con endpoints REST
├── notifications.service.ts            # Service principal con lógica de negocio
├── notification-helper.service.ts      # Helper service para facilitar el uso
├── notifications.module.ts             # Módulo de NestJS
└── README.md
```

## Tipos de Notificaciones

### NotificationType
- `ORDER_CONFIRMATION` - Confirmación de órdenes
- `PAYMENT_SUCCESS` - Pago exitoso
- `PAYMENT_FAILED` - Pago fallido
- `PRODUCT_ALERT` - Alertas de productos
- `SYSTEM_ALERT` - Alertas del sistema
- `WELCOME` - Bienvenida a nuevos usuarios

### NotificationStatus
- `PENDING` - Pendiente de envío
- `SENT` - Enviada
- `FAILED` - Falló el envío
- `READ` - Leída por el usuario

## Endpoints API

### Públicos (requieren autenticación)
- `GET /notifications/my-notifications` - Notificaciones del usuario actual
- `GET /notifications/unread` - Notificaciones no leídas del usuario
- `GET /notifications/user-statistics` - Estadísticas del usuario
- `GET /notifications/:id` - Obtener notificación específica
- `PATCH /notifications/:id/mark-read` - Marcar como leída
- `PATCH /notifications/bulk/mark-read` - Marcar múltiples como leídas

### Administrativos (requieren rol ADMIN)
- `POST /notifications` - Crear notificación
- `GET /notifications` - Listar todas las notificaciones
- `GET /notifications/statistics` - Estadísticas generales
- `PATCH /notifications/:id` - Actualizar notificación
- `DELETE /notifications/:id` - Eliminar notificación
- `DELETE /notifications/bulk` - Eliminar múltiples notificaciones
- `DELETE /notifications/cleanup/:days` - Limpiar notificaciones antiguas

## Uso del Helper Service

```typescript
// Inyectar el helper service
constructor(
  private readonly notificationHelper: NotificationHelperService,
) {}

// Enviar notificación de bienvenida
await this.notificationHelper.sendWelcomeNotification(
  userId, 
  userEmail, 
  userName
);

// Confirmación de orden
await this.notificationHelper.sendOrderConfirmationNotification(
  userId, 
  userEmail, 
  orderNumber, 
  orderTotal
);

// Pago exitoso
await this.notificationHelper.sendPaymentSuccessNotification(
  userId, 
  userEmail, 
  orderNumber, 
  amount, 
  paymentMethod
);

// Alerta de producto
await this.notificationHelper.sendProductAlertNotification(
  userId, 
  userEmail, 
  productId, 
  productName, 
  'back_in_stock'
);

// Alerta del sistema
await this.notificationHelper.sendSystemAlertNotification(
  'Mantenimiento Programado',
  'El sistema estará en mantenimiento esta noche de 2-4 AM',
  [userId1, userId2] // usuarios específicos o undefined para todos
);
```

## Uso Directo del Service

```typescript
// Crear notificación personalizada
const notification = await this.notificationsService.create({
  title: 'Título personalizado',
  message: 'Mensaje personalizado',
  type: NotificationType.SYSTEM_ALERT,
  userId: 'user-uuid',
  userEmail: 'user@email.com',
  metadata: {
    customField: 'valor personalizado'
  }
});

// Obtener notificaciones con filtros
const result = await this.notificationsService.findAll({
  userId: 'user-uuid',
  status: NotificationStatus.UNREAD,
  type: NotificationType.ORDER_CONFIRMATION,
  page: 1,
  limit: 20
});

// Marcar como leída
await this.notificationsService.markAsRead(notificationId);

// Obtener estadísticas
const stats = await this.notificationsService.getStatistics(userId);
```

## Filtros Disponibles

- `userId` - Filtrar por usuario
- `userEmail` - Filtrar por email
- `status` - Filtrar por estado
- `type` - Filtrar por tipo
- `startDate` / `endDate` - Filtrar por rango de fechas
- `page` / `limit` - Paginación
- `sortBy` / `sortOrder` - Ordenamiento

## Base de Datos

El módulo utiliza **MongoDB** con Mongoose para almacenamiento de notificaciones, permitiendo:

- Escalabilidad para grandes volúmenes de notificaciones
- Flexibilidad en el campo `metadata`
- Consultas rápidas con índices automáticos
- Timestamps automáticos

## Configuración

Agregar las siguientes variables de entorno:

```env
# MongoDB para notificaciones
MONGODB_URI=mongodb://localhost:27017/mi_backend_notifications
```

## Integración con Otros Módulos

El módulo exporta tanto `NotificationsService` como `NotificationHelperService` para uso en:

- **AuthModule** - Notificaciones de bienvenida
- **OrdenesModule** - Confirmaciones de órdenes
- **InvoicesModule** - Notificaciones de pago
- **ProductsModule** - Alertas de productos
- **Sistema general** - Alertas administrativas

## Mantenimiento

### Limpieza Automática
```bash
# Eliminar notificaciones leídas/fallidas de más de 30 días
DELETE /notifications/cleanup/30
```

### Operaciones en Lote
```bash
# Marcar múltiples como leídas
PATCH /notifications/bulk/mark-read
{
  "notificationIds": ["id1", "id2", "id3"]
}

# Eliminar múltiples
DELETE /notifications/bulk
{
  "notificationIds": ["id1", "id2", "id3"]
}
```

## Seguridad

- Los usuarios solo pueden ver sus propias notificaciones
- Los administradores tienen acceso completo
- Validación de permisos en todas las operaciones
- Protección contra acceso no autorizado

## Ejemplo de Respuesta API

```json
{
  "success": true,
  "message": "Notifications retrieved successfully",
  "data": {
    "notifications": [...],
    "total": 50,
    "page": 1,
    "totalPages": 5
  }
}
```
