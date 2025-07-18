import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigValidationService {
  private readonly logger = new Logger(ConfigValidationService.name);

  constructor(private configService: ConfigService) {
    this.validateConfiguration();
  }

  private validateConfiguration(): void {
    const requiredVars = [
      'DB_HOST',
      'DB_PORT',
      'DB_USERNAME',
      'DB_PASSWORD',
      'DB_NAME',
      'MONGODB_URI',
      'JWT_SECRET',
    ];

    const optionalVars = [
      'GMAIL_USER',
      'GMAIL_APP_PASSWORD',
      'FRONTEND_URL',
      'ADMIN_EMAIL',
      'NODE_ENV',
      'PORT',
      'LOG_LEVEL',
    ];

    // Validar variables requeridas
    const missingRequired = requiredVars.filter(
      (varName) => !this.configService.get(varName)
    );

    if (missingRequired.length > 0) {
      this.logger.error(
        `❌ Missing required environment variables: ${missingRequired.join(', ')}`
      );
      throw new Error(`Missing required environment variables: ${missingRequired.join(', ')}`);
    }

    // Mostrar estado de variables opcionales
    const missingOptional = optionalVars.filter(
      (varName) => !this.configService.get(varName)
    );

    if (missingOptional.length > 0) {
      this.logger.warn(
        `⚠️  Missing optional environment variables: ${missingOptional.join(', ')}`
      );
    }

    // Validaciones específicas
    this.validateDatabaseConfig();
    this.validateJWTConfig();
    this.validateEmailConfig();

    this.logger.log('✅ Environment configuration validated successfully');
  }

  private validateDatabaseConfig(): void {
    const dbPort = this.configService.get('DB_PORT');
    if (isNaN(Number(dbPort))) {
      throw new Error('DB_PORT must be a valid number');
    }

    const mongoUri = this.configService.get('MONGODB_URI');
    if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
      throw new Error('MONGODB_URI must be a valid MongoDB connection string');
    }

    this.logger.log('✅ Database configuration is valid');
  }

  private validateJWTConfig(): void {
    const jwtSecret = this.configService.get('JWT_SECRET');
    if (jwtSecret.length < 32) {
      this.logger.warn('⚠️  JWT_SECRET should be at least 32 characters long for security');
    }

    const jwtExpires = this.configService.get('JWT_EXPIRES_IN');
    if (!jwtExpires.match(/^\d+[smhd]$/)) {
      this.logger.warn('⚠️  JWT_EXPIRES_IN format should be like "3600s", "1h", "7d"');
    }

    this.logger.log('✅ JWT configuration is valid');
  }

  private validateEmailConfig(): void {
    const gmailUser = this.configService.get('GMAIL_USER');
    const gmailPass = this.configService.get('GMAIL_APP_PASSWORD');

    if (gmailUser && !gmailUser.includes('@')) {
      this.logger.warn('⚠️  GMAIL_USER should be a valid email address');
    }

    if (gmailUser && !gmailPass) {
      this.logger.warn('⚠️  GMAIL_APP_PASSWORD is required when GMAIL_USER is set');
    }

    if (gmailUser && gmailPass) {
      this.logger.log('✅ Email configuration is valid');
    } else {
      this.logger.warn('⚠️  Email service not configured - emails will be simulated');
    }
  }

  // Métodos helper para obtener configuración validada
  getDatabaseConfig() {
    return {
      host: this.configService.get('DB_HOST'),
      port: parseInt(this.configService.get('DB_PORT') || '5432'),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      ssl: this.configService.get('DB_SSL') === 'true',
    };
  }

  getMongoConfig() {
    return {
      uri: this.configService.get('MONGODB_URI'),
    };
  }

  getJWTConfig() {
    return {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN', '3600s'),
    };
  }

  getEmailConfig() {
    return {
      user: this.configService.get('GMAIL_USER'),
      password: this.configService.get('GMAIL_APP_PASSWORD'),
      adminEmail: this.configService.get('ADMIN_EMAIL'),
    };
  }

  getAppConfig() {
    return {
      port: parseInt(this.configService.get('PORT', '3000')),
      environment: this.configService.get('NODE_ENV', 'development'),
      frontendUrl: this.configService.get('FRONTEND_URL', 'http://localhost:3000'),
      logLevel: this.configService.get('LOG_LEVEL', 'info'),
    };
  }
}
