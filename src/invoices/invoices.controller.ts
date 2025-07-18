import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { PayInvoiceDto } from './dto/pay-invoice.dto';
import { FilterInvoicesDto } from './dto/filter-invoices.dto';
import { Invoice } from './invoice.entity';
import { InvoiceStatus } from './enums/invoice-status.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN) // Solo admins pueden crear facturas
  async create(@Body() createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    return await this.invoicesService.create(createInvoiceDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN) // Solo admins pueden ver todas las facturas
  async findAll(@Query() filterDto: FilterInvoicesDto): Promise<Invoice[]> {
    return await this.invoicesService.findAll(filterDto);
  }

  @Get('statistics')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN) // Solo admins pueden ver estadísticas
  async getStatistics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return await this.invoicesService.getStatistics(startDate, endDate);
  }

  @Get('customer/:customerId')
  async findByCustomer(@Param('customerId') customerId: string): Promise<Invoice[]> {
    return await this.invoicesService.findByCustomer(customerId);
  }

  @Get('number/:invoiceNumber')
  async findByInvoiceNumber(@Param('invoiceNumber') invoiceNumber: string): Promise<Invoice> {
    return await this.invoicesService.findByInvoiceNumber(invoiceNumber);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Invoice> {
    return await this.invoicesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN) // Solo admins pueden actualizar facturas
  async update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    return await this.invoicesService.update(id, updateInvoiceDto);
  }

  @Patch(':id/status/:status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN) // Solo admins pueden cambiar estado
  async changeStatus(
    @Param('id') id: string,
    @Param('status') status: InvoiceStatus,
  ): Promise<Invoice> {
    return await this.invoicesService.changeStatus(id, status);
  }

  @Patch(':id/pay')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN) // Solo admins pueden marcar como pagada
  async payInvoice(
    @Param('id') id: string,
    @Body() payInvoiceDto: PayInvoiceDto,
  ): Promise<Invoice> {
    return await this.invoicesService.payInvoice(id, payInvoiceDto);
  }

  @Patch(':id/cancel')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN) // Solo admins pueden cancelar facturas
  async cancelInvoice(@Param('id') id: string): Promise<Invoice> {
    return await this.invoicesService.cancelInvoice(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN) // Solo admins pueden eliminar facturas
  async remove(@Param('id') id: string): Promise<void> {
    return await this.invoicesService.remove(id);
  }
}
