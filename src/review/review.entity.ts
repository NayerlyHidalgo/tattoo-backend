import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/products.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @Column({ name: 'usuario_id' })
  usuarioId: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'producto_id' })
  producto: Product;

  @Column({ name: 'producto_id' })
  productoId: string;

  @Column('int', { comment: 'Calificación de 1 a 5 estrellas' })
  calificacion: number;

  @Column('text')
  comentario: string;

  @Column({ default: true })
  aprobada: boolean;

  @Column({ default: false })
  compraVerificada: boolean; // si el usuario realmente compró el producto

  @Column('simple-array', { nullable: true })
  imagenes: string[]; // fotos del producto en uso

  @Column({ default: 0 })
  utilVotes: number; // votos de "útil" de otros usuarios

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
