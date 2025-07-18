import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, Index } from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/products.entity';

@Entity('carts')
@Index(['usuarioId', 'activo'])
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @Column({ name: 'usuario_id' })
  usuarioId: string;

  @OneToMany(() => CartItem, item => item.cart, { cascade: true, eager: true })
  items: CartItem[];

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Método helper para calcular el total
  calculateTotal(): number {
    return this.items?.reduce((total, item) => total + Number(item.subtotal), 0) || 0;
  }

  // Método helper para obtener cantidad total de items
  getTotalItems(): number {
    return this.items?.reduce((total, item) => total + item.cantidad, 0) || 0;
  }
}

@Entity('cart_items')
@Index(['cartId'])
@Index(['productoId'])
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cart, cart => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @Column({ name: 'cart_id' })
  cartId: string;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'producto_id' })
  producto: Product;

  @Column({ name: 'producto_id' })
  productoId: string;

  @Column()
  nombreProducto: string;

  @Column()
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precioUnitario: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column({ nullable: true })
  imagenProducto: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Método helper para calcular subtotal
  calculateSubtotal(): number {
    return Number(this.precioUnitario) * this.cantidad;
  }
}
