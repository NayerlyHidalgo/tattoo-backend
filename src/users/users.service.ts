import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRole } from './enums/user-role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email }
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hash de la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['ordenes'],
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        telefono: true,
        direccion: true,
        ciudad: true,
        codigoPostal: true,
        pais: true,
        role: true,
        isActive: true,
        profile: true,
        emailVerified: true,
        fechaNacimiento: true,
        estudioTatuaje: true,
        aniosExperiencia: true,
        especialidades: true,
        createdAt: true,
        updatedAt: true,
        // Excluir password de la respuesta
      }
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['ordenes'],
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        telefono: true,
        direccion: true,
        ciudad: true,
        codigoPostal: true,
        pais: true,
        role: true,
        isActive: true,
        profile: true,
        emailVerified: true,
        fechaNacimiento: true,
        estudioTatuaje: true,
        aniosExperiencia: true,
        especialidades: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email }
    });

    if (!user) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }

    return user;
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return await this.userRepository.find({
      where: { role },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        telefono: true,
        direccion: true,
        ciudad: true,
        codigoPostal: true,
        pais: true,
        role: true,
        isActive: true,
        profile: true,
        emailVerified: true,
        fechaNacimiento: true,
        estudioTatuaje: true,
        aniosExperiencia: true,
        especialidades: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Si se está actualizando el email, verificar que no exista
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email }
      });

      if (existingUser) {
        throw new ConflictException('El email ya está registrado');
      }
    }

    // Si se está actualizando la contraseña, hacer hash
    if (updateUserDto.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(updateUserDto.password, saltRounds);
      updateUserDto = { ...updateUserDto, password: hashedPassword };
    }

    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async softDelete(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = false;
    return await this.userRepository.save(user);
  }

  async activate(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = true;
    return await this.userRepository.save(user);
  }

  async verifyEmail(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.emailVerified = true;
    return await this.userRepository.save(user);
  }
}
