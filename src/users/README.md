# Users API Documentation

## Endpoints disponibles

### 1. Crear usuario
- **POST** `/users`
- **Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "firstName": "string (opcional)",
  "lastName": "string (opcional)",
  "telefono": "string (opcional)",
  "direccion": "string (opcional)",
  "ciudad": "string (opcional)",
  "codigoPostal": "string (opcional)",
  "pais": "string (opcional)",
  "role": "admin | customer | tattoo_artist (opcional, default: customer)",
  "isActive": "boolean (opcional, default: true)",
  "profile": "string (opcional)",
  "emailVerified": "boolean (opcional, default: false)",
  "fechaNacimiento": "Date (opcional)",
  "estudioTatuaje": "string (opcional)",
  "aniosExperiencia": "number (opcional)",
  "especialidades": "string (opcional)"
}
```

### 2. Obtener todos los usuarios
- **GET** `/users`
- **Query params:**
  - `role`: Filtrar por rol (admin, customer, tattoo_artist)

### 3. Obtener usuario por ID
- **GET** `/users/:id`

### 4. Obtener usuario por email
- **GET** `/users/email/:email`

### 5. Actualizar usuario
- **PATCH** `/users/:id`
- **Body:** Cualquier campo del CreateUserDto (todos opcionales)

### 6. Eliminar usuario (hard delete)
- **DELETE** `/users/:id`

### 7. Desactivar usuario (soft delete)
- **PATCH** `/users/:id/soft-delete`

### 8. Activar usuario
- **PATCH** `/users/:id/activate`

### 9. Verificar email
- **PATCH** `/users/:id/verify-email`

## Roles disponibles
- `admin`: Administrador
- `customer`: Cliente
- `tattoo_artist`: Artista de tatuajes

## Notas importantes
- Las contraseñas se hashean automáticamente con bcrypt
- El campo `password` no se incluye en las respuestas por seguridad
- El email debe ser único
- Se incluye validación con class-validator
- Las relaciones con órdenes se cargan automáticamente
