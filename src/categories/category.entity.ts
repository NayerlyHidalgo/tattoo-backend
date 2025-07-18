import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
// import { Product } from '../products/products.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  descripcion: string;

  @Column({ nullable: true })
  icono: string; // URL del icono de la categoría

  @Column({ default: true })
  activa: boolean;

  @Column({ default: 0 })
  orden: number; // para ordenar las categorías

  // Relación uno a muchos con productos - Comentado hasta crear la entidad Product
  // @OneToMany(() => Product, product => product.categoria)
  // productos: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
