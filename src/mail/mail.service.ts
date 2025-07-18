import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Email, EmailStatus, EmailProvider } from './email.entity';
import { SendMailDto } from './dto/send-mail.dto';
import { FilterEmailsDto } from './dto/filter-emails.dto';
import { BulkEmailDto } from './dto/bulk-email.dto';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    @InjectRepository(Email)
    private emailRepository: Repository<Email>,
    private configService: ConfigService,
  ) {}

  async sendMail(sendMailDto: SendMailDto): Promise<Email> {
    // Crear registro en base de datos
    const email = this.emailRepository.create({
      ...sendMailDto,
      from: this.configService.get('GMAIL_USER') || 'noreply@example.com',
      provider: EmailProvider.GMAIL,
      status: EmailStatus.PENDING,
    });

    const savedEmail = await this.emailRepository.save(email);

    try {
      // Simular envío de email (aquí implementarías la lógica real)
      this.logger.log(`Simulating email send to ${sendMailDto.to}`);
      
      // Simular éxito
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Actualizar registro como enviado
      savedEmail.markAsSent(`msg_${Date.now()}`);
      await this.emailRepository.save(savedEmail);

      this.logger.log(`Email sent successfully to ${sendMailDto.to}`);
      
      return savedEmail;
    } catch (error) {
      // Marcar como fallido
      savedEmail.markAsFailed(error.message);
      await this.emailRepository.save(savedEmail);
      
      this.logger.error(`Failed to send email to ${sendMailDto.to}`, error);
      throw new BadRequestException(`Failed to send email: ${error.message}`);
    }
  }

  async findAll(filterDto: FilterEmailsDto): Promise<{
    emails: Email[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      to,
      from,
      status,
      provider,
      subject,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'sentAt',
      sortOrder = 'desc'
    } = filterDto;

    const queryBuilder = this.emailRepository.createQueryBuilder('email');

    // Aplicar filtros
    if (to) queryBuilder.andWhere('email.to ILIKE :to', { to: `%${to}%` });
    if (from) queryBuilder.andWhere('email.from ILIKE :from', { from: `%${from}%` });
    if (status) queryBuilder.andWhere('email.status = :status', { status });
    if (provider) queryBuilder.andWhere('email.provider = :provider', { provider });
    if (subject) queryBuilder.andWhere('email.subject ILIKE :subject', { subject: `%${subject}%` });

    // Filtro por fechas
    if (startDate) queryBuilder.andWhere('email.createdAt >= :startDate', { startDate });
    if (endDate) queryBuilder.andWhere('email.createdAt <= :endDate', { endDate });

    // Calcular total
    const total = await queryBuilder.getCount();

    // Aplicar paginación y ordenamiento
    const emails = await queryBuilder
      .orderBy(`email.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      emails,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Email> {
    const email = await this.emailRepository.findOne({ where: { id } });
    if (!email) {
      throw new NotFoundException(`Email with ID ${id} not found`);
    }
    return email;
  }

  async resendEmail(id: string): Promise<Email> {
    const email = await this.findOne(id);
    
    if (!email.canRetry()) {
      throw new BadRequestException('Email cannot be retried (max retries reached or not in failed status)');
    }

    try {
      // Simular reenvío
      this.logger.log(`Resending email to ${email.to}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Actualizar registro como enviado
      email.markAsSent(`msg_resend_${Date.now()}`);
      email.errorMessage = ''; // Limpiar error anterior
      await this.emailRepository.save(email);

      this.logger.log(`Email resent successfully to ${email.to}`);
      
      return email;
    } catch (error) {
      // Marcar como fallido nuevamente
      email.markAsFailed(error.message);
      await this.emailRepository.save(email);
      
      this.logger.error(`Failed to resend email to ${email.to}`, error);
      throw new BadRequestException(`Failed to resend email: ${error.message}`);
    }
  }

  async bulkDelete(bulkEmailDto: BulkEmailDto): Promise<{ deletedCount: number }> {
    const result = await this.emailRepository
      .createQueryBuilder()
      .delete()
      .from(Email)
      .where('id IN (:...ids)', { ids: bulkEmailDto.emailIds })
      .execute();

    return { deletedCount: result.affected || 0 };
  }

  async remove(id: string): Promise<void> {
    const email = await this.findOne(id);
    await this.emailRepository.remove(email);
  }

  async getStatistics(): Promise<{
    total: number;
    sent: number;
    failed: number;
    pending: number;
    delivered: number;
    opened: number;
    byProvider: Record<string, number>;
    last24Hours: number;
  }> {
    const [
      total,
      sent,
      failed,
      pending,
      delivered,
      opened,
      providerStats,
      last24Hours
    ] = await Promise.all([
      this.emailRepository.count(),
      this.emailRepository.count({ where: { status: EmailStatus.SENT } }),
      this.emailRepository.count({ where: { status: EmailStatus.FAILED } }),
      this.emailRepository.count({ where: { status: EmailStatus.PENDING } }),
      this.emailRepository.count({ where: { status: EmailStatus.DELIVERED } }),
      this.emailRepository.count({ where: { status: EmailStatus.OPENED } }),
      this.emailRepository
        .createQueryBuilder('email')
        .select('email.provider', 'provider')
        .addSelect('COUNT(*)', 'count')
        .groupBy('email.provider')
        .getRawMany(),
      this.emailRepository
        .createQueryBuilder('email')
        .where('email.createdAt >= :date', { date: new Date(Date.now() - 24 * 60 * 60 * 1000) })
        .getCount()
    ]);

    const byProvider = providerStats.reduce((acc, stat) => {
      acc[stat.provider] = parseInt(stat.count);
      return acc;
    }, {});

    return {
      total,
      sent,
      failed,
      pending,
      delivered,
      opened,
      byProvider,
      last24Hours
    };
  }

  // Función para consumir API pública (simulada)
  async fetchUserListFromPublicApi(): Promise<any[]> {
    try {
      // Simular llamada a API externa
      this.logger.log('Fetching users from public API...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos simulados
      const mockUsers = [
        { id: 1, name: 'Juan Pérez', email: 'juan@example.com', phone: '123-456-7890' },
        { id: 2, name: 'María García', email: 'maria@example.com', phone: '098-765-4321' },
        { id: 3, name: 'Carlos López', email: 'carlos@example.com', phone: '555-123-4567' },
        { id: 4, name: 'Ana Martínez', email: 'ana@example.com', phone: '111-222-3333' },
        { id: 5, name: 'Luis Rodríguez', email: 'luis@example.com', phone: '999-888-7777' },
      ];
      
      this.logger.log('Successfully fetched users from public API');
      return mockUsers;
    } catch (error) {
      this.logger.error('Failed to fetch users from public API', error);
      throw new BadRequestException('Failed to fetch users from external API');
    }
  }

  // Función para enviar emails masivos con template
  async sendBulkEmails(emails: string[], subject: string, templateId: string, templateData: Record<string, any>): Promise<{
    sent: number;
    failed: number;
    results: Array<{ email: string; success: boolean; error?: string }>
  }> {
    const results: Array<{ email: string; success: boolean; error?: string }> = [];
    let sent = 0;
    let failed = 0;

    for (const email of emails) {
      try {
        await this.sendMail({
          to: email,
          subject,
          text: `Email template: ${templateId}`,
          html: this.processTemplate(templateId, templateData),
          templateId,
          templateData
        });
        
        results.push({ email, success: true });
        sent++;
      } catch (error) {
        results.push({ email, success: false, error: error.message });
        failed++;
      }
    }

    return { sent, failed, results };
  }

  private processTemplate(templateId: string, data: Record<string, any>): string {
    // Aquí puedes implementar tu lógica de templates
    // Por ahora, un template básico
    switch (templateId) {
      case 'welcome':
        return `
          <h1>¡Bienvenido ${data.name}!</h1>
          <p>Gracias por registrarte en nuestra plataforma.</p>
          <p>Tu email es: ${data.email}</p>
        `;
      case 'order-confirmation':
        return `
          <h1>Confirmación de Orden</h1>
          <p>Tu orden #${data.orderNumber} ha sido confirmada.</p>
          <p>Total: $${data.total}</p>
        `;
      default:
        return `<p>Template not found: ${templateId}</p>`;
    }
  }

  // Función para limpiar emails antiguos
  async cleanupOldEmails(daysOld: number = 30): Promise<{ deletedCount: number }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await this.emailRepository
      .createQueryBuilder()
      .delete()
      .from(Email)
      .where('createdAt < :cutoffDate', { cutoffDate })
      .andWhere('status IN (:...statuses)', { statuses: [EmailStatus.SENT, EmailStatus.DELIVERED, EmailStatus.FAILED] })
      .execute();

    return { deletedCount: result.affected || 0 };
  }
}
