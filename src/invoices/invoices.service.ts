import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Invoice } from './invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { PayInvoiceDto } from './dto/pay-invoice.dto';
import { FilterInvoicesDto } from './dto/filter-invoices.dto';
import { InvoiceStatus } from './enums/invoice-status.enum';
import { UsersService } from '../users/users.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    private usersService: UsersService,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    // Verificar que el cliente existe
    const customer = await this.usersService.findOne(createInvoiceDto.customerId);

    // Generar número de factura único
    const invoiceNumber = await this.generateInvoiceNumber();

    // Crear la factura
    const invoice = this.invoiceRepository.create({
      ...createInvoiceDto,
      invoiceNumber,
      customer,
      status: createInvoiceDto.status || InvoiceStatus.DRAFT,
      taxPercentage: createInvoiceDto.taxPercentage || 0,
      discountAmount: createInvoiceDto.discountAmount || 0,
      discountPercentage: createInvoiceDto.discountPercentage || 0,
    });

    // Calcular totales
    invoice.updateTotals();

    return await this.invoiceRepository.save(invoice);
  }

  async findAll(filterDto?: FilterInvoicesDto): Promise<Invoice[]> {
    const queryBuilder = this.invoiceRepository.createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.customer', 'customer');

    // Aplicar filtros
    if (filterDto?.status) {
      queryBuilder.andWhere('invoice.status = :status', { status: filterDto.status });
    }

    if (filterDto?.customerId) {
      queryBuilder.andWhere('invoice.customer.id = :customerId', { customerId: filterDto.customerId });
    }

    if (filterDto?.paymentMethod) {
      queryBuilder.andWhere('invoice.paymentMethod = :paymentMethod', { paymentMethod: filterDto.paymentMethod });
    }

    if (filterDto?.invoiceNumber) {
      queryBuilder.andWhere('invoice.invoiceNumber ILIKE :invoiceNumber', { 
        invoiceNumber: `%${filterDto.invoiceNumber}%` 
      });
    }

    if (filterDto?.startDate && filterDto?.endDate) {
      queryBuilder.andWhere('invoice.issueDate BETWEEN :startDate AND :endDate', {
        startDate: filterDto.startDate,
        endDate: filterDto.endDate,
      });
    } else if (filterDto?.startDate) {
      queryBuilder.andWhere('invoice.issueDate >= :startDate', { startDate: filterDto.startDate });
    } else if (filterDto?.endDate) {
      queryBuilder.andWhere('invoice.issueDate <= :endDate', { endDate: filterDto.endDate });
    }

    return await queryBuilder
      .orderBy('invoice.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['customer']
    });

    if (!invoice) {
      throw new NotFoundException(`Factura con ID ${id} no encontrada`);
    }

    return invoice;
  }

  async findByInvoiceNumber(invoiceNumber: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { invoiceNumber },
      relations: ['customer']
    });

    if (!invoice) {
      throw new NotFoundException(`Factura con número ${invoiceNumber} no encontrada`);
    }

    return invoice;
  }

  async findByCustomer(customerId: string): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      where: { customer: { id: customerId } },
      relations: ['customer'],
      order: { createdAt: 'DESC' }
    });
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.findOne(id);

    // No permitir actualizar facturas pagadas o canceladas
    if (invoice.status === InvoiceStatus.PAID || invoice.status === InvoiceStatus.CANCELLED) {
      throw new BadRequestException('No se puede actualizar una factura pagada o cancelada');
    }

    // Si se cambia el cliente, verificar que existe
    if (updateInvoiceDto.customerId && updateInvoiceDto.customerId !== invoice.customer.id) {
      const customer = await this.usersService.findOne(updateInvoiceDto.customerId);
      invoice.customer = customer;
    }

    // Actualizar campos
    Object.assign(invoice, updateInvoiceDto);

    // Recalcular totales si cambiaron valores relevantes
    if (updateInvoiceDto.subtotal !== undefined || 
        updateInvoiceDto.taxPercentage !== undefined || 
        updateInvoiceDto.discountAmount !== undefined || 
        updateInvoiceDto.discountPercentage !== undefined) {
      invoice.updateTotals();
    }

    return await this.invoiceRepository.save(invoice);
  }

  async remove(id: string): Promise<void> {
    const invoice = await this.findOne(id);
    
    // Solo permitir eliminar facturas en borrador
    if (invoice.status !== InvoiceStatus.DRAFT) {
      throw new BadRequestException('Solo se pueden eliminar facturas en borrador');
    }

    await this.invoiceRepository.remove(invoice);
  }

  async changeStatus(id: string, status: InvoiceStatus): Promise<Invoice> {
    const invoice = await this.findOne(id);

    // Validar transiciones de estado
    this.validateStatusTransition(invoice.status, status);

    invoice.status = status;

    // Si se marca como vencida, establecer fecha de vencimiento si no existe
    if (status === InvoiceStatus.OVERDUE && !invoice.dueDate) {
      invoice.dueDate = new Date();
    }

    return await this.invoiceRepository.save(invoice);
  }

  async payInvoice(id: string, payInvoiceDto: PayInvoiceDto): Promise<Invoice> {
    const invoice = await this.findOne(id);

    // Verificar que la factura se puede pagar
    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('La factura ya está pagada');
    }

    if (invoice.status === InvoiceStatus.CANCELLED) {
      throw new BadRequestException('No se puede pagar una factura cancelada');
    }

    // Actualizar información de pago
    invoice.status = InvoiceStatus.PAID;
    invoice.paymentMethod = payInvoiceDto.paymentMethod;
    if (payInvoiceDto.paymentReference) {
      invoice.paymentReference = payInvoiceDto.paymentReference;
    }
    invoice.paidDate = payInvoiceDto.paidDate ? new Date(payInvoiceDto.paidDate) : new Date();

    return await this.invoiceRepository.save(invoice);
  }

  async cancelInvoice(id: string): Promise<Invoice> {
    const invoice = await this.findOne(id);

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('No se puede cancelar una factura pagada');
    }

    invoice.status = InvoiceStatus.CANCELLED;
    return await this.invoiceRepository.save(invoice);
  }

  async getStatistics(startDate?: string, endDate?: string) {
    let dateFilter = {};
    
    if (startDate && endDate) {
      dateFilter = { issueDate: Between(startDate, endDate) };
    } else if (startDate) {
      dateFilter = { issueDate: Between(startDate, new Date().toISOString()) };
    }

    const [
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      cancelledInvoices,
      draftInvoices,
      totalRevenue,
      pendingRevenue
    ] = await Promise.all([
      this.invoiceRepository.count({ where: dateFilter }),
      this.invoiceRepository.count({ where: { ...dateFilter, status: InvoiceStatus.PAID } }),
      this.invoiceRepository.count({ where: { ...dateFilter, status: InvoiceStatus.PENDING } }),
      this.invoiceRepository.count({ where: { ...dateFilter, status: InvoiceStatus.OVERDUE } }),
      this.invoiceRepository.count({ where: { ...dateFilter, status: InvoiceStatus.CANCELLED } }),
      this.invoiceRepository.count({ where: { ...dateFilter, status: InvoiceStatus.DRAFT } }),
      this.invoiceRepository
        .createQueryBuilder('invoice')
        .select('SUM(invoice.total)', 'total')
        .where({ ...dateFilter, status: InvoiceStatus.PAID })
        .getRawOne(),
      this.invoiceRepository
        .createQueryBuilder('invoice')
        .select('SUM(invoice.total)', 'total')
        .where({ ...dateFilter, status: InvoiceStatus.PENDING })
        .getRawOne(),
    ]);

    return {
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      cancelledInvoices,
      draftInvoices,
      totalRevenue: parseFloat(totalRevenue?.total || 0),
      pendingRevenue: parseFloat(pendingRevenue?.total || 0),
    };
  }

  private async generateInvoiceNumber(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const prefix = `INV-${currentYear}-`;

    // Buscar el último número de factura del año actual
    const lastInvoice = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .where('invoice.invoiceNumber LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('invoice.invoiceNumber', 'DESC')
      .getOne();

    let nextNumber = 1;
    
    if (lastInvoice) {
      const lastNumber = parseInt(lastInvoice.invoiceNumber.split('-')[2]);
      nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(6, '0')}`;
  }

  private validateStatusTransition(currentStatus: InvoiceStatus, newStatus: InvoiceStatus): void {
    const allowedTransitions: Record<InvoiceStatus, InvoiceStatus[]> = {
      [InvoiceStatus.DRAFT]: [InvoiceStatus.PENDING, InvoiceStatus.CANCELLED],
      [InvoiceStatus.PENDING]: [InvoiceStatus.PAID, InvoiceStatus.OVERDUE, InvoiceStatus.CANCELLED],
      [InvoiceStatus.OVERDUE]: [InvoiceStatus.PAID, InvoiceStatus.CANCELLED],
      [InvoiceStatus.PAID]: [], // Las facturas pagadas no cambian de estado
      [InvoiceStatus.CANCELLED]: [], // Las facturas canceladas no cambian de estado
    };

    if (!allowedTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `No se puede cambiar el estado de ${currentStatus} a ${newStatus}`
      );
    }
  }
}
