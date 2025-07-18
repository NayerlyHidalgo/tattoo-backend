# Review Module

Este módulo maneja las reseñas de productos en el sistema.

## Características

- ✅ CRUD completo de reseñas
- ✅ Sistema de calificaciones (1-5 estrellas)
- ✅ Comentarios con texto
- ✅ Imágenes opcionales
- ✅ Sistema de aprobación/moderación
- ✅ Verificación de compra
- ✅ Votos de utilidad
- ✅ Estadísticas de producto
- ✅ Filtros avanzados
- ✅ Paginación

## Endpoints

### Públicos
- `GET /reviews` - Obtener todas las reseñas (con filtros)
- `GET /reviews/:id` - Obtener una reseña específica
- `GET /reviews/product/:productId` - Obtener reseñas de un producto
- `GET /reviews/product/:productId/stats` - Estadísticas de un producto
- `GET /reviews/user/:userId` - Obtener reseñas de un usuario

### Autenticados
- `POST /reviews` - Crear nueva reseña (requiere autenticación)
- `PATCH /reviews/:id` - Actualizar reseña propia
- `DELETE /reviews/:id` - Eliminar reseña propia
- `GET /reviews/my-reviews` - Obtener mis reseñas
- `POST /reviews/:id/util-vote` - Votar como útil

### Solo Administradores
- `PATCH /reviews/:id/approve` - Aprobar reseña
- `PATCH /reviews/:id/reject` - Rechazar reseña

## DTOs

### CreateReviewDto
```typescript
{
  productoId: string;      // Requerido
  calificacion: number;    // 1-5, requerido
  comentario: string;      // Requerido
  imagenes?: string[];     // Opcional
  compraVerificada?: boolean; // Opcional
}
```

### FilterReviewsDto
```typescript
{
  productoId?: string;
  usuarioId?: string;
  aprobada?: boolean;
  compraVerificada?: boolean;
  calificacion?: number;
  page?: number;          // Default: 1
  limit?: number;         // Default: 10, Max: 100
}
```

## Reglas de Negocio

1. **Una reseña por usuario por producto**: Un usuario no puede dejar múltiples reseñas para el mismo producto
2. **Solo el autor puede editar**: Solo el usuario que creó la reseña puede editarla (admins pueden moderar)
3. **Solo autor o admin pueden eliminar**: Restricción de permisos para eliminación
4. **Calificación válida**: Solo valores entre 1 y 5 estrellas
5. **Reseñas aprobadas por defecto**: Se pueden moderar después

## Estadísticas de Producto

El endpoint `/reviews/product/:productId/stats` devuelve:

```typescript
{
  promedio: number;       // Promedio de calificaciones
  total: number;          // Total de reseñas
  distribucion: {
    5: number;           // Cantidad de 5 estrellas
    4: number;           // Cantidad de 4 estrellas
    3: number;           // Cantidad de 3 estrellas
    2: number;           // Cantidad de 2 estrellas
    1: number;           // Cantidad de 1 estrella
  }
}
```

## Ejemplos de Uso

### Crear una reseña
```bash
POST /reviews
Authorization: Bearer <token>
{
  "productoId": "uuid-del-producto",
  "calificacion": 5,
  "comentario": "Excelente producto, muy recomendado",
  "imagenes": ["url1.jpg", "url2.jpg"]
}
```

### Obtener reseñas de un producto
```bash
GET /reviews/product/uuid-del-producto?page=1&limit=10&aprobada=true
```

### Obtener estadísticas
```bash
GET /reviews/product/uuid-del-producto/stats
```

## Relaciones

- **Usuario**: Relación ManyToOne con User (eager loading)
- **Producto**: Relación ManyToOne con Product

## Base de Datos

La entidad se mapea a la tabla `reviews` con las siguientes columnas:
- `id` (UUID, PK)
- `usuario_id` (UUID, FK)
- `producto_id` (UUID, FK)
- `calificacion` (INT, 1-5)
- `comentario` (TEXT)
- `aprobada` (BOOLEAN, default: true)
- `compra_verificada` (BOOLEAN, default: false)
- `imagenes` (simple-array)
- `util_votes` (INT, default: 0)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
