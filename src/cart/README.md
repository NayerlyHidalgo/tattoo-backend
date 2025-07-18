# Cart Module

Sistema completo de carrito de compras para el e-commerce.

## 📋 Características

- ✅ **Carrito persistente** por usuario
- ✅ **Gestión de items** (agregar, actualizar, eliminar)
- ✅ **Cálculo automático** de totales y subtotales
- ✅ **Validación de stock** en tiempo real
- ✅ **Historial de carritos** por usuario
- ✅ **Preparación para checkout** con validaciones
- ✅ **Carrito activo único** por usuario
- ✅ **Relaciones optimizadas** con productos

## 🏗️ Estructura

```
src/cart/
├── cart.entity.ts          # Entidades Cart y CartItem
├── cart.service.ts         # Lógica de negocio
├── cart.controller.ts      # Endpoints REST
├── cart.module.ts          # Módulo NestJS
└── dto/
    └── cart.dto.ts         # DTOs para validación
```

## 🎯 Endpoints Disponibles

### **Gestión del Carrito**
- `GET /cart` - Obtener carrito activo
- `GET /cart/summary` - Resumen del carrito
- `GET /cart/history` - Historial de carritos
- `GET /cart/:cartId` - Carrito específico

### **Gestión de Items**
- `POST /cart/add` - Agregar producto al carrito
- `PUT /cart/item/:cartItemId` - Actualizar cantidad de item
- `DELETE /cart/item/:cartItemId` - Eliminar item del carrito
- `DELETE /cart/clear` - Vaciar carrito completo

### **Checkout**
- `POST /cart/checkout/prepare` - Preparar carrito para checkout
- `POST /cart/deactivate` - Desactivar carrito (tras compra)

## 📝 DTOs

### **AddToCartDto**
```typescript
{
  productoId: string;  // UUID del producto
  cantidad: number;    // Cantidad mínima 1
}
```

### **UpdateCartItemDto**
```typescript
{
  cantidad: number;    // Nueva cantidad (mínima 1)
}
```

## 🔒 Seguridad

- ✅ **Autenticación requerida** para todos los endpoints
- ✅ **Validación de propiedad** - usuarios solo pueden modificar sus carritos
- ✅ **Validación de stock** antes de agregar productos
- ✅ **Validación de existencia** de productos

## 🛠️ Lógica de Negocio

### **1. Carrito Activo**
- Cada usuario tiene un solo carrito activo
- Se crea automáticamente si no existe
- Se actualiza el total automáticamente

### **2. Gestión de Items**
```typescript
// Agregar producto existente → Suma cantidades
// Producto nuevo → Crea nuevo item
// Validación de stock en cada operación
```

### **3. Cálculos Automáticos**
```typescript
// Subtotal = precioUnitario * cantidad
// Total = suma de todos los subtotales
```

### **4. Preparación para Checkout**
- Valida stock de todos los productos
- Actualiza precios si han cambiado
- Recalcula totales
- Prepara carrito para conversión a orden

## 📊 Respuestas de API

### **Carrito Completo**
```typescript
{
  id: "uuid",
  usuarioId: "uuid",
  total: 150.00,
  activo: true,
  items: [
    {
      id: "uuid",
      productoId: "uuid",
      nombreProducto: "Producto X",
      cantidad: 2,
      precioUnitario: 50.00,
      subtotal: 100.00,
      imagenProducto: "url",
      producto: { /* datos completos del producto */ }
    }
  ],
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z"
}
```

### **Resumen del Carrito**
```typescript
{
  cartId: "uuid",
  totalItems: 5,           // Cantidad total de productos
  totalAmount: 250.00,     // Monto total
  itemsCount: 3,          // Número de tipos de productos
  items: [
    {
      id: "uuid",
      productId: "uuid",
      productName: "Producto X",
      quantity: 2,
      unitPrice: 50.00,
      subtotal: 100.00,
      image: "url"
    }
  ]
}
```

## 🔄 Flujo de Uso

### **1. Usuario agrega producto:**
```bash
POST /cart/add
{
  "productoId": "uuid-producto",
  "cantidad": 2
}
```

### **2. Usuario ve su carrito:**
```bash
GET /cart
# Devuelve carrito con items y totales calculados
```

### **3. Usuario actualiza cantidad:**
```bash
PUT /cart/item/uuid-item
{
  "cantidad": 3
}
```

### **4. Usuario procede al checkout:**
```bash
POST /cart/checkout/prepare
# Valida stock y precios, prepara para orden
```

### **5. Tras compra exitosa:**
```bash
POST /cart/deactivate
# Desactiva carrito actual
```

## ⚡ Optimizaciones

### **Base de Datos**
- Índices en `usuarioId + activo` para carritos activos
- Índices en `cartId` y `productoId` para items
- Cascade delete para items al eliminar carrito

### **Queries**
- Eager loading de productos y relaciones
- Cálculos automáticos en entidad
- Consultas optimizadas con QueryBuilder

### **Validaciones**
- Stock verificado en cada operación
- Precios actualizados en checkout
- Validación de permisos por usuario

## 🐛 Manejo de Errores

### **Errores Comunes**
- `404` - Producto no encontrado
- `400` - Stock insuficiente
- `400` - Carrito vacío en checkout
- `403` - Sin permisos para modificar carrito
- `404` - Item de carrito no encontrado

### **Validaciones de Stock**
```typescript
// Al agregar producto
if (product.stock < cantidad) {
  throw new BadRequestException('Stock insuficiente');
}

// Al actualizar cantidad
if (product.stock < newQuantity) {
  throw new BadRequestException('Stock insuficiente para la cantidad solicitada');
}
```

## 📈 Métricas Sugeridas

- Productos más agregados al carrito
- Tasa de abandono de carrito
- Valor promedio de carrito
- Tiempo promedio en carrito antes de checkout

## 🔄 Integración con Otros Módulos

### **Products Module**
- Validación de existencia y stock
- Obtención de precios actualizados
- Información de productos para display

### **Orders Module**
- Conversión de carrito a orden
- Transferencia de items y totales
- Desactivación de carrito tras compra

### **Users Module**
- Autenticación y autorización
- Carritos por usuario
- Historial personalizado

¡El módulo de carrito está completo y listo para manejar todas las operaciones de e-commerce! 🛒✨
