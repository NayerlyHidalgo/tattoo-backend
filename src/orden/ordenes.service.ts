import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Orden, OrdenItem } from './orden.entity';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { UpdateOrdenDto } from './dto/update-orden.dto';
import { ChangeEstadoOrdenDto } from './dto/change-estado-orden.dto';
import { FilterOrdenesDto } from './dto/filter-ordenes.dto';
import { EstadoOrden } from './orden.entity';
import { MetodoPago } from './orden.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrdenesService {
  constructor(
    @InjectRepository(Orden)
    private ordenRepository: Repository<Orden>,
    @InjectRepository(OrdenItem)
    private ordenItemRepository: Repository<OrdenItem>,
    private usersService: UsersService,
  ) {}

  async create(createOrdenDto: CreateOrdenDto): Promise<Orden> {
    // Generar número de orden único
    const orderNumber = await this.generateOrderNumber();

    let usuario: any = undefined;
    if (createOrdenDto.usuarioId) {
      usuario = await this.usersService.findOne(createOrdenDto.usuarioId);
    }

    // Crear la orden sin los items
    const orden = this.ordenRepository.create({
      ...createOrdenDto,
      orderNumber,
      usuario,
      estado: createOrdenDto.estado || EstadoOrden.PENDIENTE,
      metodoPago: createOrdenDto.metodoPago || undefined,
      items: [],
    });

    // Guardar la orden para obtener el id
    const savedOrden = await this.ordenRepository.save(orden);

    // Crear y guardar los items
    const items = createOrdenDto.items.map(itemDto => {
      return this.ordenItemRepository.create({
        ...itemDto,
        orden: savedOrden,
      });
    });
    const savedItems = await this.ordenItemRepository.save(items);
    // Asignar los items correctamente
    (savedOrden as Orden).items = savedItems as OrdenItem[];

    return savedOrden as Orden;
  }

  async findAll(filterDto?: FilterOrdenesDto): Promise<Orden[]> {
    const queryBuilder = this.ordenRepository.createQueryBuilder('orden')
      .leftJoinAndSelect('orden.usuario', 'usuario')
      .leftJoinAndSelect('orden.items', 'items');

    if (filterDto?.usuarioId) {
      queryBuilder.andWhere('orden.usuarioId = :usuarioId', { usuarioId: filterDto.usuarioId });
    }
    if (filterDto?.estado) {
      queryBuilder.andWhere('orden.estado = :estado', { estado: filterDto.estado });
    }
    if (filterDto?.fechaDesde && filterDto?.fechaHasta) {
      queryBuilder.andWhere('orden.createdAt BETWEEN :desde AND :hasta', {
        desde: filterDto.fechaDesde,
        hasta: filterDto.fechaHasta,
      });
    }

    return await queryBuilder.orderBy('orden.createdAt', 'DESC').getMany();
  }

  async findOne(id: string): Promise<Orden> {
    const orden = await this.ordenRepository.findOne({
      where: { id },
      relations: ['usuario', 'items']
    });
    if (!orden) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }
    return orden;
  }

  async update(id: string, updateOrdenDto: UpdateOrdenDto): Promise<Orden> {
    const orden = await this.findOne(id);
    Object.assign(orden, updateOrdenDto);
    return await this.ordenRepository.save(orden);
  }

  async remove(id: string): Promise<void> {
    const orden = await this.findOne(id);
    await this.ordenRepository.remove(orden);
  }

  async changeEstado(id: string, changeEstadoDto: ChangeEstadoOrdenDto): Promise<Orden> {
    const orden = await this.findOne(id);
    orden.estado = changeEstadoDto.estado;
    if (changeEstadoDto.notas) {
      orden.notas = changeEstadoDto.notas;
    }
    return await this.ordenRepository.save(orden);
  }

  async generateOrderNumber(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const prefix = `ORD-${currentYear}-`;
    const lastOrden = await this.ordenRepository
      .createQueryBuilder('orden')
      .where('orden.orderNumber LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('orden.orderNumber', 'DESC')
      .getOne();
    let nextNumber = 1;
    if (lastOrden) {
      const lastNumber = parseInt(lastOrden.orderNumber.split('-')[2]);
      nextNumber = lastNumber + 1;
    }
    return `${prefix}${nextNumber.toString().padStart(6, '0')}`;
  }
}
