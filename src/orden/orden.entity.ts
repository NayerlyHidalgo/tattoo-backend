import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

export enum EstadoOrden {
  PENDIENTE = 'pendiente',
  CONFIRMADA = 'confirmada',
  PROCESANDO = 'procesando',
  ENVIADA = 'enviada',
  ENTREGADA = 'entregada',
  CANCELADA = 'cancelada'
}

export enum MetodoPago {
  TARJETA_CREDITO = 'tarjeta_credito',
  TARJETA_DEBITO = 'tarjeta_debito',
  PAYPAL = 'paypal',
  TRANSFERENCIA = 'transferencia',
  EFECTIVO = 'efectivo'
}


@Entity('ordenes')
export class Orden {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  orderNumber: string;

  @ManyToOne(() => User, user => user.ordenes, { eager: true, nullable: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @Column({ name: 'usuario_id', nullable: true })
  usuarioId: string;

  // Información para órdenes de invitados
  @Column('json', { nullable: true })
  guestCustomerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };

  // Información de pago
  @Column('json', { nullable: true })
  paymentInfo: {
    method: string;
    cardType: string;
    lastFour: string;
    status: string;
  };

  @OneToMany(() => OrdenItem, item => item.orden, { cascade: true, eager: true })
  items: OrdenItem[];

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  impuestos: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  costoEnvio: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  descuento: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({
    type: 'enum',
    enum: EstadoOrden,
    default: EstadoOrden.PENDIENTE,
    nullable: true
  })
  estado: EstadoOrden;

  @Column({
    type: 'enum',
    enum: MetodoPago,
    nullable: true
  })
  metodoPago: MetodoPago;

  // Información de entrega
  @Column({ nullable: true })
  direccionEnvio: string;

  @Column({ nullable: true })
  ciudadEnvio: string;

  @Column({ nullable: true })
  codigoPostalEnvio: string;

  @Column({ nullable: true })
  paisEnvio: string;

  @Column({ nullable: true })
  numeroSeguimiento: string;

  @Column({ nullable: true })
  empresaEnvio: string;

  @Column({ nullable: true })
  fechaEnvio: Date;

  @Column({ nullable: true })
  fechaEntregaEstimada: Date;

  @Column('text', { nullable: true })
  notas: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('orden_items')
export class OrdenItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Orden, orden => orden.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orden_id' })
  orden: Orden;

  @Column({ name: 'orden_id' })
  ordenId: string;

  @Column()
  productoId: string;

  @Column()
  nombreProducto: string;

  @Column()
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precioUnitario: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @CreateDateColumn()
  createdAt: Date;
}
