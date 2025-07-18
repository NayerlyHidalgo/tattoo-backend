// Tipos para estadísticas generales
export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalReviews: number;
  monthlyRevenue: number;
  growthPercentage: number;
}

// Estadísticas de ventas
export interface SalesStats {
  period: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

// Estadísticas de productos
export interface ProductStats {
  id: string;
  name: string;
  views: number;
  sales: number;
  revenue: number;
  averageRating: number;
  totalReviews: number;
}

// Estadísticas de usuarios
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByRole: Record<string, number>;
}
