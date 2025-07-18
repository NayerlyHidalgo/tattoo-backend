import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column('text')
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ nullable: true })
  marca: string;

  @Column({ nullable: true })
  modelo: string;

  @Column('text', { nullable: true })
  especificaciones: string;

  @Column('simple-array', { nullable: true })
  imagenes: string[];

  @Column({ default: true })
  disponible: boolean;

  @Column({ default: false })
  destacado: boolean;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  descuento: number; // porcentaje de descuento

  @Column({ nullable: true })
  sku: string; // código de producto

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  peso: number; // peso en gramos

  @Column({ nullable: true })
  dimensiones: string; // dimensiones del producto

  // Relación con categoría
  @ManyToOne(() => Category, { eager: true })
  @JoinColumn({ name: 'category_id' })
  categoria: Category;

  @Column({ name: 'category_id' })
  categoriaId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
