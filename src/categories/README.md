# Categories API Documentation

## Endpoints disponibles

### 📁 **Categorías públicas (sin autenticación)**

### 1. Obtener todas las categorías
- **GET** `/categories`
- **Query params:**
  - `includeInactive`: boolean (opcional) - Incluir categorías inactivas
- **Respuesta:** Array de categorías ordenadas por `orden` y `name`

### 2. Obtener solo categorías activas
- **GET** `/categories/active`
- **Respuesta:** Array de categorías activas

### 3. Obtener categoría por ID
- **GET** `/categories/:id`

### 4. Obtener categoría por nombre
- **GET** `/categories/name/:name`

---

### 🔒 **Categorías de administración (requiere autenticación + rol ADMIN)**

### 5. Crear categoría
- **POST** `/categories`
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Body:**
```json
{
  "name": "string",
  "descripcion": "string (opcional)",
  "icono": "string (opcional - URL)",
  "activa": "boolean (opcional, default: true)",
  "orden": "number (opcional, se asigna automáticamente)"
}
```

### 6. Actualizar categoría
- **PATCH** `/categories/:id`
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Body:** Cualquier campo del CreateCategoryDto (todos opcionales)

### 7. Eliminar categoría
- **DELETE** `/categories/:id`
- **Headers:** `Authorization: Bearer <jwt_token>`

### 8. Activar/Desactivar categoría (toggle)
- **PATCH** `/categories/:id/toggle-active`
- **Headers:** `Authorization: Bearer <jwt_token>`

### 9. Activar categoría
- **PATCH** `/categories/:id/activate`
- **Headers:** `Authorization: Bearer <jwt_token>`

### 10. Desactivar categoría
- **PATCH** `/categories/:id/deactivate`
- **Headers:** `Authorization: Bearer <jwt_token>`

### 11. Reordenar categorías
- **PATCH** `/categories/reorder`
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Body:**
```json
{
  "categories": [
    {"id": "uuid1", "orden": 1},
    {"id": "uuid2", "orden": 2},
    {"id": "uuid3", "orden": 3}
  ]
}
```

### 12. Estadísticas de categorías
- **GET** `/categories/stats`
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Respuesta:**
```json
{
  "total": 10,
  "active": 8,
  "inactive": 2
}
```

## Características implementadas

✅ **Validación completa** con class-validator  
✅ **Protección por roles** - Solo admins pueden crear/editar  
✅ **Ordenamiento personalizable** - Campo `orden` para organizar categorías  
✅ **Soft delete** - Campo `activa` para desactivar sin eliminar  
✅ **Nombres únicos** - Validación de duplicados  
✅ **Transacciones** - Para reordenamiento seguro  
✅ **Estadísticas** - Contadores de categorías activas/inactivas  
✅ **Endpoints públicos** - Las categorías pueden verse sin autenticación  
✅ **Auto-orden** - Si no se especifica orden, se asigna automáticamente  

## Casos de uso

### **Para usuarios públicos:**
- Ver categorías disponibles
- Navegar por categorías activas
- Buscar categoría específica

### **Para administradores:**
- Gestión completa de categorías
- Reordenamiento para mejorar UX
- Activar/desactivar según temporadas
- Ver estadísticas de uso

## Ejemplos de uso

```bash
# Ver todas las categorías activas (público)
curl -X GET http://localhost:3000/categories/active

# Crear nueva categoría (admin)
curl -X POST http://localhost:3000/categories \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Tatuajes Tribales","descripcion":"Estilos tradicionales tribales","icono":"https://example.com/tribal.png"}'

# Reordenar categorías (admin)
curl -X PATCH http://localhost:3000/categories/reorder \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"categories":[{"id":"uuid1","orden":1},{"id":"uuid2","orden":2}]}'
```
