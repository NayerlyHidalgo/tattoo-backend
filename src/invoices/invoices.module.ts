import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { Invoice } from './invoice.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice]),
    UsersModule, // Importar para usar UsersService
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService], // Exportar el servicio para usar en otros módulos
})
export class InvoicesModule {}
