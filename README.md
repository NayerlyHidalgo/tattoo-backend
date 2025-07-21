# 🎨 Tattoo Shop Backend API

API REST para gestión de tienda de tatuajes construida con NestJS, TypeScript, PostgreSQL y MongoDB.

## 🚀 Deployment

### Render (Actual)
- **Backend API**: `https://your-backend-name.onrender.com`
- **Documentación**: `https://your-backend-name.onrender.com/api/docs`

### VPS (Deprecado)
- ~~Backend: https://nestjs-tatoo-backend.desarrollo-software.xyz/~~

## 📋 Configuración para Render

### 1. Crear servicio web en Render
```
Build Command: npm ci && npm run build
Start Command: npm run start:prod
Environment: Node
Auto Deploy: Yes
```

### 2. Variables de entorno requeridas
```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-name.onrender.com
DB_HOST=your-postgres-host
DB_PORT=5432
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_NAME=tattoo_shop
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
```

### 3. Base de datos
- **PostgreSQL**: Crear PostgreSQL service en Render
- **MongoDB**: Usar MongoDB Atlas (recomendado)

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run start:dev

# Compilar para producción
npm run build

# Ejecutar en producción
npm run start:prod
```

## 📁 Estructura del Proyecto

```
src/
├── auth/           # Autenticación y autorización
├── users/          # Gestión de usuarios
├── products/       # Catálogo de productos
├── cart/           # Carrito de compras
├── orders/         # Gestión de pedidos
├── invoices/       # Facturación
├── notifications/  # Sistema de notificaciones
├── mail/           # Servicio de email
├── logs/           # Sistema de logs
└── common/         # Utilidades compartidas
```

## 🔧 Características

- ✅ Autenticación JWT
- ✅ Roles y permisos
- ✅ CRUD completo para productos
- ✅ Carrito de compras
- ✅ Sistema de pedidos
- ✅ Notificaciones por email
- ✅ Logs de auditoría
- ✅ Documentación Swagger
- ✅ Validación de datos
- ✅ Manejo de errores
- ✅ CORS configurado

## 📝 API Endpoints

### Autenticación
- `POST /auth/login` - Login de usuario
- `POST /auth/register` - Registro de usuario
- `POST /auth/logout` - Logout de usuario

### Productos
- `GET /products` - Listar productos
- `GET /products/:id` - Obtener producto
- `POST /products` - Crear producto (Admin)
- `PUT /products/:id` - Actualizar producto (Admin)
- `DELETE /products/:id` - Eliminar producto (Admin)

### Carrito
- `GET /cart` - Obtener carrito
- `POST /cart/items` - Agregar item al carrito
- `PUT /cart/items/:id` - Actualizar item del carrito
- `DELETE /cart/items/:id` - Eliminar item del carrito

### Pedidos
- `GET /orders` - Listar pedidos
- `POST /orders` - Crear pedido
- `GET /orders/:id` - Obtener pedido
- `PUT /orders/:id/status` - Actualizar estado

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 📊 Monitoring

- Logs almacenados en PostgreSQL
- Interceptor de logging para todas las requests
- Filtro global de excepciones
- Health check endpoint: `/health`

## 🔒 Seguridad

- Validación de entrada con class-validator
- Sanitización de datos
- Rate limiting (configurar en Render)
- CORS configurado
- JWT con expiración

## 📧 Contacto

Para consultas técnicas o colaboraciones, contactar al equipo de desarrollo.
