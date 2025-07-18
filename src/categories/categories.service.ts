import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ReorderCategoriesDto } from './dto/reorder-categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Verificar si el nombre ya existe
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name }
    });

    if (existingCategory) {
      throw new ConflictException('Ya existe una categoría con ese nombre');
    }

    // Si no se especifica orden, asignar el siguiente número
    if (createCategoryDto.orden === undefined) {
      const maxOrder = await this.categoryRepository
        .createQueryBuilder('category')
        .select('MAX(category.orden)', 'max')
        .getRawOne();
      
      createCategoryDto.orden = (maxOrder.max || 0) + 1;
    }

    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async findAll(includeInactive: boolean = false): Promise<Category[]> {
    const queryBuilder = this.categoryRepository.createQueryBuilder('category');
    
    if (!includeInactive) {
      queryBuilder.where('category.activa = :activa', { activa: true });
    }
    
    return await queryBuilder
      .orderBy('category.orden', 'ASC')
      .addOrderBy('category.name', 'ASC')
      .getMany();
  }

  async findAllActive(): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { activa: true },
      order: { orden: 'ASC', name: 'ASC' }
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id }
    });

    if (!category) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    return category;
  }

  async findByName(name: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { name }
    });

    if (!category) {
      throw new NotFoundException(`Categoría con nombre "${name}" no encontrada`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    // Si se está actualizando el nombre, verificar que no exista
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name }
      });

      if (existingCategory) {
        throw new ConflictException('Ya existe una categoría con ese nombre');
      }
    }

    await this.categoryRepository.update(id, updateCategoryDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }

  async toggleActive(id: string): Promise<Category> {
    const category = await this.findOne(id);
    category.activa = !category.activa;
    return await this.categoryRepository.save(category);
  }

  async activate(id: string): Promise<Category> {
    const category = await this.findOne(id);
    category.activa = true;
    return await this.categoryRepository.save(category);
  }

  async deactivate(id: string): Promise<Category> {
    const category = await this.findOne(id);
    category.activa = false;
    return await this.categoryRepository.save(category);
  }

  async reorder(reorderDto: ReorderCategoriesDto): Promise<Category[]> {
    const queryRunner = this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Actualizar el orden de cada categoría
      for (const item of reorderDto.categories) {
        await queryRunner.manager.update(Category, item.id, { orden: item.orden });
      }

      await queryRunner.commitTransaction();
      
      // Retornar todas las categorías ordenadas
      return await this.findAll();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getStats(): Promise<{total: number, active: number, inactive: number}> {
    const total = await this.categoryRepository.count();
    const active = await this.categoryRepository.count({ where: { activa: true } });
    const inactive = total - active;

    return { total, active, inactive };
  }
}
