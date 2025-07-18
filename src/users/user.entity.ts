import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Orden } from '../orden/orden.entity';
import { UserRole } from './enums/user-role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  direccion: string;

  @Column({ nullable: true })
  ciudad: string;

  @Column({ nullable: true })
  codigoPostal: string;

  @Column({ nullable: true })
  pais: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  profile: string; // URL de imagen de perfil

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  fechaNacimiento: Date;

  // Para tatuadores profesionales
  @Column({ nullable: true })
  estudioTatuaje: string;

  @Column({ nullable: true })
  aniosExperiencia: number;

  @Column('text', { nullable: true })
  especialidades: string; // estilos de tatuaje

  // Relación con órdenes - Comentado hasta crear la entidad Orden
  // @OneToMany(() => Orden, orden => orden.usuario)
  // ordenes: Orden[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  // Relación con órdenes
  @OneToMany(() => Orden, orden => orden.usuario)
  ordenes: Orden[];
}
