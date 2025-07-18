import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { InvoicesModule } from './invoices/invoices.module';
import { OrdenesModule } from './orden/ordenes.module';
import { ProductsModule } from './products/products.module';
import { ReviewModule } from './review/review.module';
import { LogsModule } from './logs/logs.module';
import { CartModule } from './cart/cart.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MailModule } from './mail/mail.module';
import { LoggingModule } from './common/logging.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggingModule,
    // PostgreSQL para la mayoría de entidades
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      logging: process.env.NODE_ENV === 'development',
    }),
    // MongoDB para notificaciones (Atlas)
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/tattoo-shop'
    ),
    UsersModule, 
    AuthModule,
    CategoriesModule,
    InvoicesModule,
    OrdenesModule,
    ProductsModule,
    ReviewModule,
    LogsModule,
    CartModule,
    NotificationsModule,
    MailModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
