import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum EmailStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  DELIVERED = 'delivered',
  BOUNCED = 'bounced',
  OPENED = 'opened'
}

export enum EmailProvider {
  GMAIL = 'gmail',
  SENDGRID = 'sendgrid',
  SMTP = 'smtp'
}

@Entity('emails')
@Index(['to'])
@Index(['status'])
@Index(['provider'])
@Index(['sentAt'])
export class Email {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  to: string;

  @Column({ nullable: true })
  from: string;

  @Column('simple-array', { nullable: true })
  cc: string[];

  @Column('simple-array', { nullable: true })
  bcc: string[];

  @Column()
  subject: string;

  @Column('text')
  text: string;

  @Column('text', { nullable: true })
  html: string;

  @Column('simple-array', { nullable: true })
  attachments: string[];

  @Column({
    type: 'enum',
    enum: EmailStatus,
    default: EmailStatus.PENDING
  })
  status: EmailStatus;

  @Column({
    type: 'enum',
    enum: EmailProvider,
    default: EmailProvider.GMAIL
  })
  provider: EmailProvider;

  @Column({ nullable: true })
  externalId: string; // ID del proveedor externo

  @Column({ default: false })
  isHighPriority: boolean;

  @Column({ nullable: true })
  templateId: string;

  @Column('json', { nullable: true })
  templateData: Record<string, any>;

  @Column('json', { nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  errorMessage: string;

  @Column({ default: 0 })
  retryCount: number;

  @Column({ nullable: true })
  sentAt: Date;

  @Column({ nullable: true })
  deliveredAt: Date;

  @Column({ nullable: true })
  openedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Método helper para marcar como enviado
  markAsSent(externalId?: string): void {
    this.status = EmailStatus.SENT;
    this.sentAt = new Date();
    if (externalId) {
      this.externalId = externalId;
    }
  }

  // Método helper para marcar como fallido
  markAsFailed(errorMessage: string): void {
    this.status = EmailStatus.FAILED;
    this.errorMessage = errorMessage;
    this.retryCount += 1;
  }

  // Método helper para marcar como entregado
  markAsDelivered(): void {
    this.status = EmailStatus.DELIVERED;
    this.deliveredAt = new Date();
  }

  // Método helper para marcar como abierto
  markAsOpened(): void {
    this.status = EmailStatus.OPENED;
    this.openedAt = new Date();
  }

  // Verificar si puede ser reintentado
  canRetry(): boolean {
    return this.status === EmailStatus.FAILED && this.retryCount < 3;
  }
}
