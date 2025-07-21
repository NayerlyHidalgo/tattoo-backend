import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Configurar CORS para Render
    const allowedOrigins: (string | RegExp)[] = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://nestjs-tatoo-backend.desarrollo-software.xyz',
      process.env.FRONTEND_URL || 'http://localhost:3000',
    ];

    // En producción, agregar dominios de Render
    if (process.env.NODE_ENV === 'production') {
      allowedOrigins.push('https://tattoo-frontend.onrender.com');
      allowedOrigins.push(/\.onrender\.com$/);
    }

    app.enableCors({
      origin: allowedOrigins.filter(Boolean),
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    // Pipes globales
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Interceptors globales
    app.useGlobalInterceptors(new LoggingInterceptor());

    // Filtros globales
    app.useGlobalFilters(new AllExceptionsFilter());

    // Configurar puerto para Render (usa PORT del environment o 3001 por defecto)
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

    // Bind a 0.0.0.0 para Render
    await app.listen(port, '0.0.0.0');

    logger.log(`🚀 Application is running on: http://0.0.0.0:${port}`);
    logger.log(`📊 Environment: ${configService.get('NODE_ENV', 'development')}`);
    logger.log(`🗄️  PostgreSQL Host: ${configService.get('DB_HOST')}`);
    logger.log(`🍃 MongoDB URI: ${configService.get('MONGODB_URI') ? 'Connected' : 'Not configured'}`);
    logger.log(`📧 Email User: ${configService.get('GMAIL_USER')}`);
  } catch (error) {
    logger.error('❌ Error starting application:', error);
    process.exit(1);
  }
}

bootstrap();
