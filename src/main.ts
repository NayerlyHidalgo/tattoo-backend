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

    // Configurar CORS
    app.enableCors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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

    // Configurar puerto
    const port = configService.get('PORT', 3000);

    await app.listen(port);

    logger.log(`🚀 Application is running on: http://localhost:${port}`);
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
