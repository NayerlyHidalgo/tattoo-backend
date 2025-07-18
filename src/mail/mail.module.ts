import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailHelperService } from './mail-helper.service';
import { Email } from './email.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Email]),
    ConfigModule, // Para acceder a variables de entorno
  ],
  controllers: [MailController],
  providers: [MailService, MailHelperService],
  exports: [MailService, MailHelperService], // Para poder usar los services en otros módulos
})
export class MailModule {}
