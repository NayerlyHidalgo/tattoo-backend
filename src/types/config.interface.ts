// Configuración de base de datos
export interface DatabaseConfig {
  type: 'postgres' | 'mysql' | 'sqlite' | 'mongodb';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
}

// Configuración JWT
export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshSecret?: string;
  refreshExpiresIn?: string;
}

// Configuración de la aplicación
export interface AppConfig {
  port: number;
  environment: 'development' | 'production' | 'test';
  apiPrefix: string;
  corsOrigins: string[];
}

// Configuración de archivos/uploads
export interface FileConfig {
  maxSize: number;
  allowedTypes: string[];
  uploadPath: string;
  publicPath: string;
}
