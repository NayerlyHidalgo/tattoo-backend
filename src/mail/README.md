# Mail Module

Este módulo maneja el sistema completo de envío y gestión de emails de la aplicación, permitiendo enviar emails individuales, masivos, y mantener un historial completo de todos los envíos.

## Características

- ✅ CRUD completo de emails enviados
- ✅ Sistema de estados (pending, sent, failed, delivered, opened)
- ✅ Soporte para múltiples proveedores (Gmail, SendGrid, SMTP)
- ✅ Templates de email predefinidos
- ✅ Envío de emails masivos
- ✅ Reintento automático de emails fallidos
- ✅ Filtrado y paginación avanzada
- ✅ Estadísticas y métricas
- ✅ Limpieza automática de emails antiguos
- ✅ Helper service para facilitar el envío
- ✅ Integración con API externa de ejemplo
- ✅ Seguridad por roles y permisos

## Estructura

```
mail/
├── dto/
│   ├── send-mail.dto.ts           # DTO para envío de emails
│   ├── filter-emails.dto.ts       # DTO para filtrar con paginación
│   └── bulk-email.dto.ts          # DTOs para operaciones en lote
├── email.entity.ts                # Entidad TypeORM para emails
├── mail.controller.ts             # Controlador con endpoints REST
├── mail.service.ts                # Service principal con lógica de negocio
├── mail-helper.service.ts         # Helper service para emails comunes
├── mail.module.ts                 # Módulo de NestJS
└── README.md
```

## Estados de Email

### EmailStatus
- `PENDING` - Pendiente de envío
- `SENT` - Enviado
- `FAILED` - Falló el envío
- `DELIVERED` - Entregado
- `BOUNCED` - Rebotado
- `OPENED` - Abierto por el destinatario

### EmailProvider
- `GMAIL` - Gmail SMTP
- `SENDGRID` - SendGrid API
- `SMTP` - SMTP personalizado

## Endpoints API

### Envío de Emails
- `POST /mail/send` - Enviar email individual (Admin)
- `POST /mail/bulk-send` - Enviar emails masivos (Admin)
- `POST /mail/emails/:id/resend` - Reenviar email fallido (Admin)

### Gestión de Emails
- `GET /mail/emails` - Listar todos los emails (Admin)
- `GET /mail/emails/:id` - Obtener email específico (Admin)
- `DELETE /mail/emails/:id` - Eliminar email (Admin)
- `DELETE /mail/emails/bulk` - Eliminar múltiples emails (Admin)

### Estadísticas y Mantenimiento
- `GET /mail/statistics` - Estadísticas de emails (Admin)
- `DELETE /mail/cleanup/:days` - Limpiar emails antiguos (Admin)

### API Externa
- `GET /mail/public-api/users` - Obtener usuarios de API externa (Admin)

### Endpoints Legacy (compatibilidad)
- `POST /mail/gmail` - Enviar email (formato anterior)
- `GET /mail/public-api` - API externa (formato anterior)

## Uso del Helper Service

```typescript
// Inyectar el helper service
constructor(
  private readonly mailHelper: MailHelperService,
) {}

// Enviar email de bienvenida
await this.mailHelper.sendWelcomeEmail(
  userEmail, 
  userName
);

// Confirmación de orden
await this.mailHelper.sendOrderConfirmationEmail(
  userEmail, 
  userName, 
  orderNumber, 
  orderTotal
);

// Pago exitoso
await this.mailHelper.sendPaymentSuccessEmail(
  userEmail, 
  userName, 
  orderNumber, 
  amount, 
  paymentMethod
);

// Pago fallido
await this.mailHelper.sendPaymentFailedEmail(
  userEmail, 
  userName, 
  orderNumber, 
  amount, 
  errorReason
);

// Restablecimiento de contraseña
await this.mailHelper.sendPasswordResetEmail(
  userEmail, 
  userName, 
  resetToken
);

// Newsletter
await this.mailHelper.sendNewsletterEmail(
  userEmail, 
  userName, 
  subject, 
  content
);

// Formulario de contacto
await this.mailHelper.sendContactFormEmail(
  name, 
  email, 
  subject, 
  message
);
```

## Uso Directo del Service

```typescript
// Enviar email personalizado
const email = await this.mailService.sendMail({
  to: 'user@example.com',
  subject: 'Título personalizado',
  text: 'Mensaje en texto plano',
  html: '<h1>Mensaje HTML</h1>',
  cc: ['cc@example.com'],
  bcc: ['bcc@example.com'],
  attachments: ['/path/to/file.pdf'],
  isHighPriority: true,
  templateId: 'custom-template',
  templateData: { key: 'value' }
});

// Obtener emails con filtros
const result = await this.mailService.findAll({
  to: 'user@example.com',
  status: EmailStatus.SENT,
  provider: EmailProvider.GMAIL,
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  page: 1,
  limit: 20
});

// Reenviar email fallido
await this.mailService.resendEmail(emailId);

// Obtener estadísticas
const stats = await this.mailService.getStatistics();

// Envío masivo
const bulkResult = await this.mailService.sendBulkEmails(
  ['user1@example.com', 'user2@example.com'],
  'Subject',
  'welcome',
  { companyName: 'Mi Empresa' }
);
```

## Templates Disponibles

El sistema incluye templates predefinidos:

- **welcome** - Email de bienvenida
- **order-confirmation** - Confirmación de orden
- **payment-success** - Pago exitoso
- **payment-failed** - Pago fallido
- **password-reset** - Restablecimiento de contraseña
- **newsletter** - Boletín informativo
- **contact-form** - Formulario de contacto

## Configuración

Agregar las siguientes variables de entorno:

```env
# Configuración Gmail
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# URLs de frontend
FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=admin@yourcompany.com
```

### Configurar Gmail App Password

1. Ir a Google Account settings
2. Activar 2-Factor Authentication
3. Generar App Password para la aplicación
4. Usar esa contraseña en `GMAIL_APP_PASSWORD`

## Filtros Disponibles

- `to` / `from` - Filtrar por destinatario/remitente
- `status` - Filtrar por estado del email
- `provider` - Filtrar por proveedor
- `subject` - Filtrar por asunto (búsqueda parcial)
- `startDate` / `endDate` - Filtrar por rango de fechas
- `page` / `limit` - Paginación
- `sortBy` / `sortOrder` - Ordenamiento

## Base de Datos

El módulo utiliza **PostgreSQL** con TypeORM, almacenando:

- Historial completo de emails enviados
- Estados de entrega y apertura
- Metadata de templates y adjuntos
- Contadores de reintento
- Índices optimizados para consultas rápidas

## Integración con Otros Módulos

El módulo exporta tanto `MailService` como `MailHelperService` para uso en:

- **AuthModule** - Emails de bienvenida y reset de password
- **OrdenesModule** - Confirmaciones de órdenes
- **InvoicesModule** - Notificaciones de pago
- **NotificationsModule** - Respaldo por email de notificaciones
- **Sistema general** - Newsletters y contacto

## Mantenimiento

### Limpieza Automática
```bash
# Eliminar emails de más de 30 días
DELETE /mail/cleanup/30
```

### Operaciones en Lote
```bash
# Eliminar múltiples emails
DELETE /mail/emails/bulk
{
  "emailIds": ["id1", "id2", "id3"]
}

# Envío masivo
POST /mail/bulk-send
{
  "emails": ["user1@example.com", "user2@example.com"],
  "subject": "Boletín Semanal",
  "templateId": "newsletter",
  "templateData": { "content": "Contenido del boletín..." }
}
```

## Monitoreo y Estadísticas

El endpoint de estadísticas proporciona:

```json
{
  "total": 1500,
  "sent": 1350,
  "failed": 50,
  "pending": 100,
  "delivered": 1200,
  "opened": 800,
  "byProvider": {
    "gmail": 1400,
    "sendgrid": 100
  },
  "last24Hours": 25
}
```

## Seguridad

- Solo administradores pueden enviar y gestionar emails
- Validación de entrada en todos los DTOs
- Logging completo de operaciones
- Protección contra spam con rate limiting
- Sanitización de contenido HTML

## Ejemplo de Respuesta API

```json
{
  "success": true,
  "message": "Email sent successfully",
  "data": {
    "id": "uuid",
    "to": "user@example.com",
    "subject": "Welcome!",
    "status": "sent",
    "provider": "gmail",
    "sentAt": "2024-01-15T10:30:00Z",
    "externalId": "msg_12345"
  }
}
```

## Próximas Funcionalidades

- [ ] Integración con más proveedores (AWS SES, Mailgun)
- [ ] Editor visual de templates
- [ ] Webhooks para eventos de entrega
- [ ] A/B testing de emails
- [ ] Métricas avanzadas de engagement
