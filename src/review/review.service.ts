import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { FilterReviewsDto } from './dto/filter-reviews.dto';
import { User } from '../users/user.entity';
import { UserRole } from '../users/enums/user-role.enum';
import { LoggerHelperService } from '../logs/logger-helper.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private readonly loggerHelper: LoggerHelperService,
  ) {}

  async create(createReviewDto: CreateReviewDto, user: User): Promise<Review> {
    // Verificar si el usuario ya tiene una reseña para este producto
    const existingReview = await this.reviewRepository.findOne({
      where: {
        usuarioId: user.id,
        productoId: createReviewDto.productoId,
      },
    });

    if (existingReview) {
      throw new BadRequestException('Ya has dejado una reseña para este producto');
    }

    const review = this.reviewRepository.create({
      ...createReviewDto,
      usuarioId: user.id,
      aprobada: true, // Por defecto aprobada, se puede cambiar según lógica de negocio
    });

    const savedReview = await this.reviewRepository.save(review);

    // Log the review creation
    await this.loggerHelper.logReviewCreated(
      user.id,
      savedReview.id,
      createReviewDto.productoId,
      createReviewDto.calificacion
    );

    return savedReview;
  }

  async findAll(filterDto: FilterReviewsDto) {
    const { page = 1, limit = 10, ...filters } = filterDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.usuario', 'usuario')
      .leftJoinAndSelect('review.producto', 'producto');

    // Aplicar filtros
    if (filters.productoId) {
      queryBuilder.andWhere('review.productoId = :productoId', { productoId: filters.productoId });
    }

    if (filters.usuarioId) {
      queryBuilder.andWhere('review.usuarioId = :usuarioId', { usuarioId: filters.usuarioId });
    }

    if (filters.aprobada !== undefined) {
      queryBuilder.andWhere('review.aprobada = :aprobada', { aprobada: filters.aprobada });
    }

    if (filters.compraVerificada !== undefined) {
      queryBuilder.andWhere('review.compraVerificada = :compraVerificada', { compraVerificada: filters.compraVerificada });
    }

    if (filters.calificacion) {
      queryBuilder.andWhere('review.calificacion = :calificacion', { calificacion: filters.calificacion });
    }

    // Ordenar por fecha de creación (más recientes primero)
    queryBuilder.orderBy('review.createdAt', 'DESC');

    const [reviews, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['usuario', 'producto'],
    });

    if (!review) {
      throw new NotFoundException(`Review con ID ${id} no encontrada`);
    }

    return review;
  }

  async findByProduct(productoId: string, filterDto: FilterReviewsDto = {}) {
    return this.findAll({ ...filterDto, productoId });
  }

  async findByUser(usuarioId: string, filterDto: FilterReviewsDto = {}) {
    return this.findAll({ ...filterDto, usuarioId });
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, user: User): Promise<Review> {
    const review = await this.findOne(id);

    // Solo el autor de la reseña puede editarla (excepto admins que pueden aprobar/desaprobar)
    if (review.usuarioId !== user.id && !this.isAdmin(user)) {
      throw new ForbiddenException('No tienes permisos para editar esta reseña');
    }

    // Si no es admin, no puede cambiar el estado de aprobación
    if (!this.isAdmin(user) && updateReviewDto.aprobada !== undefined) {
      delete updateReviewDto.aprobada;
    }

    Object.assign(review, updateReviewDto);
    return await this.reviewRepository.save(review);
  }

  async remove(id: string, user: User): Promise<void> {
    const review = await this.findOne(id);

    // Solo el autor o un admin puede eliminar la reseña
    if (review.usuarioId !== user.id && !this.isAdmin(user)) {
      throw new ForbiddenException('No tienes permisos para eliminar esta reseña');
    }

    await this.reviewRepository.remove(review);

    // Log the deletion
    await this.loggerHelper.logReviewDeleted(user.id, id);
  }

  async approveReview(id: string, adminUser?: User): Promise<Review> {
    const review = await this.findOne(id);
    review.aprobada = true;
    const updatedReview = await this.reviewRepository.save(review);

    // Log the approval
    if (adminUser) {
      await this.loggerHelper.logReviewApproved(adminUser.id, id);
    }

    return updatedReview;
  }

  async rejectReview(id: string, adminUser?: User, reason?: string): Promise<Review> {
    const review = await this.findOne(id);
    review.aprobada = false;
    const updatedReview = await this.reviewRepository.save(review);

    // Log the rejection
    if (adminUser) {
      await this.loggerHelper.logReviewRejected(adminUser.id, id, reason);
    }

    return updatedReview;
  }

  async addUtilVote(id: string): Promise<Review> {
    const review = await this.findOne(id);
    review.utilVotes += 1;
    return await this.reviewRepository.save(review);
  }

  async getProductStats(productoId: string) {
    const stats = await this.reviewRepository
      .createQueryBuilder('review')
      .select([
        'AVG(review.calificacion) as promedio',
        'COUNT(review.id) as total',
        'COUNT(CASE WHEN review.calificacion = 5 THEN 1 END) as cinco_estrellas',
        'COUNT(CASE WHEN review.calificacion = 4 THEN 1 END) as cuatro_estrellas',
        'COUNT(CASE WHEN review.calificacion = 3 THEN 1 END) as tres_estrellas',
        'COUNT(CASE WHEN review.calificacion = 2 THEN 1 END) as dos_estrellas',
        'COUNT(CASE WHEN review.calificacion = 1 THEN 1 END) as una_estrella',
      ])
      .where('review.productoId = :productoId', { productoId })
      .andWhere('review.aprobada = true')
      .getRawOne();

    return {
      promedio: parseFloat(stats.promedio) || 0,
      total: parseInt(stats.total) || 0,
      distribucion: {
        5: parseInt(stats.cinco_estrellas) || 0,
        4: parseInt(stats.cuatro_estrellas) || 0,
        3: parseInt(stats.tres_estrellas) || 0,
        2: parseInt(stats.dos_estrellas) || 0,
        1: parseInt(stats.una_estrella) || 0,
      },
    };
  }

  private isAdmin(user: User): boolean {
    return user.role === UserRole.ADMIN;
  }
}
