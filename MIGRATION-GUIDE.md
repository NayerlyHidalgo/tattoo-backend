# 🔄 Guía de Migración a Render

Esta guía te ayudará a completar la migración de VPS a Render.

## 📋 Checklist de Migración

### ✅ Backend - Preparación (Completado)
- [x] Rama `feature/migrate-to-render` creada
- [x] `main.ts` actualizado para Render
- [x] CORS configurado para `.onrender.com`
- [x] Puerto configurado para Render (PORT env var)
- [x] Binding a `0.0.0.0` para Render
- [x] `render.yaml` creado
- [x] `.env.render` creado con variables de ejemplo
- [x] README actualizado

### 🔲 Backend - Render Setup (Pendiente)
- [ ] Crear cuenta en [render.com](https://render.com)
- [ ] Conectar repositorio GitHub
- [ ] Crear **Web Service** para backend
- [ ] Configurar build command: `npm ci && npm run build`
- [ ] Configurar start command: `npm run start:prod`
- [ ] Configurar variables de entorno (ver `.env.render`)

### 🔲 Base de Datos (Pendiente)
#### PostgreSQL
- [ ] Crear **PostgreSQL service** en Render, O
- [ ] Usar base de datos externa (Railway, Supabase, etc.)
- [ ] Copiar datos de VPS a nueva BD
- [ ] Configurar `DATABASE_URL` en backend service

#### MongoDB
- [ ] Crear cluster en [MongoDB Atlas](https://cloud.mongodb.com)
- [ ] Configurar `MONGODB_URI` en backend service

### ✅ Frontend - Preparación (Completado)
- [x] `render.yaml` creado
- [x] `.env.production` creado
- [x] Variables configuradas para producción

### 🔲 Frontend - Render Setup (Pendiente)
- [ ] Crear **Static Site** en Render
- [ ] Configurar build command: `npm ci && npm run build`
- [ ] Configurar publish directory: `./build`
- [ ] Configurar `REACT_APP_API_URL` con URL del backend

### 🔲 Testing y Validación (Pendiente)
- [ ] Backend responde en Render URL
- [ ] Frontend carga correctamente
- [ ] Login funciona
- [ ] CRUD de productos funciona
- [ ] Carrito funciona
- [ ] Emails se envían correctamente

### 🔲 Cleanup (Pendiente)
- [ ] Actualizar URLs en documentación
- [ ] Notificar usuarios del cambio
- [ ] Backup y desactivar VPS
- [ ] Merge de rama `feature/migrate-to-render` a `main`

## 🚀 Pasos Detallados

### 1. Configurar Backend en Render

1. Ve a [render.com](https://render.com) y crea cuenta
2. Conecta tu repositorio GitHub
3. Crear nuevo **Web Service**:
   ```
   Repository: NayerlyHidalgo/tattoo-backend
   Branch: feature/migrate-to-render (luego cambiar a main)
   Root Directory: mi-backend
   Runtime: Node
   Build Command: npm ci && npm run build
   Start Command: npm run start:prod
   ```

4. Configurar variables de entorno:
   ```
   NODE_ENV=production
   PORT=10000
   FRONTEND_URL=https://tu-frontend.onrender.com
   DB_HOST=tu-postgres-host
   DB_PORT=5432
   DB_USERNAME=tu-username
   DB_PASSWORD=tu-password
   DB_NAME=tattoo_shop
   MONGODB_URI=tu-mongodb-uri
   JWT_SECRET=tu-jwt-secret
   JWT_EXPIRES_IN=7d
   GMAIL_USER=tu-email@gmail.com
   GMAIL_PASS=tu-app-password
   ```

### 2. Configurar Base de Datos

#### Opción A: PostgreSQL en Render
1. Crear **PostgreSQL service** en Render
2. Copiar connection string
3. Configurar `DATABASE_URL` en backend service

#### Opción B: MongoDB Atlas
1. Crear cluster en MongoDB Atlas
2. Configurar IP whitelist (0.0.0.0/0 para Render)
3. Crear usuario y password
4. Copiar connection string

### 3. Configurar Frontend en Render

1. Crear nuevo **Static Site**:
   ```
   Repository: NayerlyHidalgo/tattoo-backend
   Branch: feature/migrate-to-render
   Root Directory: tattoo-frontend
   Build Command: npm ci && npm run build
   Publish Directory: build
   ```

2. Configurar variables de entorno:
   ```
   REACT_APP_API_URL=https://tu-backend.onrender.com
   ```

### 4. Testing

1. Verificar que el backend responde:
   ```bash
   curl https://tu-backend.onrender.com/health
   ```

2. Verificar que el frontend carga:
   ```
   https://tu-frontend.onrender.com
   ```

3. Probar funcionalidades principales

## ⚠️ Consideraciones Importantes

### Limitaciones del Plan Gratuito de Render
- **Sleep mode**: Servicios se duermen después de 15 min de inactividad
- **Build time**: Máximo 10 minutos
- **Recursos**: 512MB RAM, 0.1 CPU

### Performance Tips
- Usar **keep-alive** services para evitar sleep
- Optimizar build times
- Considerar plan pago para producción

### URLs Finales
Una vez completado tendrás:
- **Backend**: `https://tattoo-backend-api.onrender.com`
- **Frontend**: `https://tattoo-frontend.onrender.com`
- **Docs**: `https://tattoo-backend-api.onrender.com/api/docs`

## 🆘 Troubleshooting

### Backend no inicia
- Verificar logs en Render dashboard
- Verificar variables de entorno
- Verificar que `PORT` está configurado

### Frontend no carga
- Verificar build logs
- Verificar que `REACT_APP_API_URL` es correcto
- Verificar CORS en backend

### Base de datos no conecta
- Verificar connection string
- Verificar firewall/whitelist
- Verificar credenciales

## 📞 Siguiente Paso

El siguiente paso es ir a [render.com](https://render.com) y seguir los pasos de la sección "Pasos Detallados" para configurar los servicios.
