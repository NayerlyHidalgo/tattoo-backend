# API de Autenticación y Autorización

## Endpoints de Autenticación

### 1. Registro
- **POST** `/auth/register`
- **Body:**
```json
{
  "username": "string",
  "email": "string", 
  "password": "string (mínimo 6 caracteres)",
  "firstName": "string (opcional)",
  "lastName": "string (opcional)",
  "role": "admin | customer | tattoo_artist (opcional, default: customer)"
}
```

### 2. Login
- **POST** `/auth/login`
- **Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
- **Respuesta:**
```json
{
  "access_token": "jwt_token",
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "role": "admin | customer | tattoo_artist",
    "firstName": "string",
    "lastName": "string"
  }
}
```

### 3. Perfil del usuario autenticado
- **GET** `/auth/profile`
- **Headers:** `Authorization: Bearer <jwt_token>`

## Roles y Permisos

### ADMIN
- ✅ Crear usuarios
- ✅ Ver todos los usuarios
- ✅ Buscar usuarios por email
- ✅ Eliminar usuarios
- ✅ Activar/desactivar usuarios
- ✅ Verificar emails

### CUSTOMER / TATTOO_ARTIST
- ✅ Ver su propio perfil
- ✅ Actualizar su propio perfil
- ❌ No pueden crear, eliminar o ver otros usuarios

## Uso de JWT

1. **Obtener token**: Hacer login en `/auth/login`
2. **Usar token**: Incluir en headers: `Authorization: Bearer <token>`
3. **Token expira**: En 24 horas (configurable)

## Ejemplo de uso

```bash
# 1. Registrarse
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@test.com","password":"123456","role":"admin"}'

# 2. Hacer login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"123456"}'

# 3. Usar el token para acceder a rutas protegidas
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer <tu_jwt_token>"
```
