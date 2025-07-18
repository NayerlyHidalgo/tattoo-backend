# Invoices API Documentation

## Endpoints disponibles

### 🔒 **Todas las rutas requieren autenticación JWT**

---

### 📊 **Gestión de Facturas (Solo ADMIN)**

### 1. Crear factura
- **POST** `/invoices`
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Roles:** ADMIN
- **Body:**
```json
{
  "customerId": "uuid",
  "issueDate": "2025-01-16T00:00:00.000Z",
  "dueDate": "2025-01-30T00:00:00.000Z (opcional)",
  "status": "draft | pending | paid | cancelled | overdue (opcional)",
  "customerName": "string (opcional)",
  "customerEmail": "string (opcional)",
  "customerPhone": "string (opcional)",
  "customerAddress": "string (opcional)",
  "customerDocument": "string (opcional)",
  "customerDocumentType": "string (opcional)",
  "subtotal": 100.00,
  "taxPercentage": 12.0,
  "discountAmount": 10.00,
  "discountPercentage": 5.0,
  "paymentMethod": "cash | credit_card | debit_card | bank_transfer | paypal | other (opcional)",
  "paymentReference": "string (opcional)",
  "notes": "string (opcional)",
  "terms": "string (opcional)"
}
```

### 2. Listar todas las facturas con filtros
- **GET** `/invoices`
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Roles:** ADMIN
- **Query params:**
  - `status`: Filtrar por estado
  - `customerId`: Filtrar por cliente
  - `startDate`: Fecha inicio (YYYY-MM-DD)
  - `endDate`: Fecha fin (YYYY-MM-DD)
  - `paymentMethod`: Filtrar por método de pago
  - `invoiceNumber`: Buscar por número de factura

### 3. Obtener factura por ID
- **GET** `/invoices/:id`
- **Headers:** `Authorization: Bearer <jwt_token>`

### 4. Obtener factura por número
- **GET** `/invoices/number/:invoiceNumber`
- **Headers:** `Authorization: Bearer <jwt_token>`

### 5. Obtener facturas por cliente
- **GET** `/invoices/customer/:customerId`
- **Headers:** `Authorization: Bearer <jwt_token>`

### 6. Actualizar factura
- **PATCH** `/invoices/:id`
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Roles:** ADMIN
- **Body:** Cualquier campo del CreateInvoiceDto (todos opcionales)
- **Nota:** No se pueden actualizar facturas pagadas o canceladas

### 7. Cambiar estado de factura
- **PATCH** `/invoices/:id/status/:status`
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Roles:** ADMIN
- **Estados válidos:** draft, pending, paid, cancelled, overdue

### 8. Marcar factura como pagada
- **PATCH** `/invoices/:id/pay`
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Roles:** ADMIN
- **Body:**
```json
{
  "paymentMethod": "cash | credit_card | debit_card | bank_transfer | paypal | other",
  "paymentReference": "string (opcional)",
  "paidDate": "2025-01-16T00:00:00.000Z (opcional, default: now)"
}
```

### 9. Cancelar factura
- **PATCH** `/invoices/:id/cancel`
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Roles:** ADMIN

### 10. Eliminar factura
- **DELETE** `/invoices/:id`
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Roles:** ADMIN
- **Nota:** Solo se pueden eliminar facturas en borrador

### 11. Estadísticas de facturación
- **GET** `/invoices/statistics`
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Roles:** ADMIN
- **Query params:**
  - `startDate`: Fecha inicio para el reporte
  - `endDate`: Fecha fin para el reporte
- **Respuesta:**
```json
{
  "totalInvoices": 150,
  "paidInvoices": 120,
  "pendingInvoices": 20,
  "overdueInvoices": 5,
  "cancelledInvoices": 3,
  "draftInvoices": 2,
  "totalRevenue": 15000.50,
  "pendingRevenue": 2500.00
}
```

---

## Estados de Factura

### **Flujo de estados:**
1. **DRAFT** → Borrador (puede editarse/eliminarse)
2. **PENDING** → Pendiente de pago
3. **PAID** → Pagada (estado final)
4. **OVERDUE** → Vencida
5. **CANCELLED** → Cancelada (estado final)

### **Transiciones válidas:**
- `DRAFT` → `PENDING`, `CANCELLED`
- `PENDING` → `PAID`, `OVERDUE`, `CANCELLED`
- `OVERDUE` → `PAID`, `CANCELLED`
- `PAID` → *(no cambia)*
- `CANCELLED` → *(no cambia)*

---

## Características implementadas

✅ **Numeración automática** - Formato: INV-YYYY-XXXXXX  
✅ **Validación de transiciones** - Estados controlados  
✅ **Cálculos automáticos** - Subtotales, impuestos, descuentos  
✅ **Filtros avanzados** - Por fecha, estado, cliente, etc.  
✅ **Protección por roles** - Solo admins pueden gestionar  
✅ **Estadísticas completas** - Reportes de facturación  
✅ **Validaciones de negocio** - No editar facturas pagadas  
✅ **Información de cliente snapshot** - Datos del cliente al momento de facturación  
✅ **Múltiples métodos de pago** - Flexibilidad en pagos  
✅ **Relación con usuarios** - Integración completa con sistema de usuarios  

---

## Casos de uso

### **Para Administradores:**
- Crear facturas para clientes
- Gestionar estados de facturas
- Procesar pagos
- Ver reportes y estadísticas
- Filtrar y buscar facturas

### **Para el Sistema:**
- Numeración automática correlativa
- Cálculos automáticos de totales
- Validación de reglas de negocio
- Auditoría completa de cambios

---

## Ejemplos de uso

```bash
# Crear factura
curl -X POST http://localhost:3000/invoices \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "uuid-del-cliente",
    "issueDate": "2025-01-16",
    "subtotal": 100.00,
    "taxPercentage": 12.0
  }'

# Marcar como pagada
curl -X PATCH http://localhost:3000/invoices/{id}/pay \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod": "credit_card",
    "paymentReference": "REF123456"
  }'

# Obtener estadísticas del mes
curl -X GET "http://localhost:3000/invoices/statistics?startDate=2025-01-01&endDate=2025-01-31" \
  -H "Authorization: Bearer <token>"

# Filtrar facturas pendientes
curl -X GET "http://localhost:3000/invoices?status=pending" \
  -H "Authorization: Bearer <token>"
```
