import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  ParseBoolPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ReorderCategoriesDto } from './dto/reorder-categories.dto';
import { Category } from './category.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Solo admins pueden crear categorías
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  async findAll(@Query('includeInactive', new ParseBoolPipe({ optional: true })) includeInactive?: boolean): Promise<Category[]> {
    return await this.categoriesService.findAll(includeInactive || false);
  }

  @Get('active')
  async findAllActive(): Promise<Category[]> {
    return await this.categoriesService.findAllActive();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Solo admins pueden ver estadísticas
  async getStats() {
    return await this.categoriesService.getStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    return await this.categoriesService.findOne(id);
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string): Promise<Category> {
    return await this.categoriesService.findByName(name);
  }

  @Patch('reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Solo admins pueden reordenar
  async reorder(@Body() reorderDto: ReorderCategoriesDto): Promise<Category[]> {
    return await this.categoriesService.reorder(reorderDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Solo admins pueden actualizar
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Solo admins pueden activar/desactivar
  async toggleActive(@Param('id') id: string): Promise<Category> {
    return await this.categoriesService.toggleActive(id);
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Solo admins pueden activar
  async activate(@Param('id') id: string): Promise<Category> {
    return await this.categoriesService.activate(id);
  }

  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Solo admins pueden desactivar
  async deactivate(@Param('id') id: string): Promise<Category> {
    return await this.categoriesService.deactivate(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Solo admins pueden eliminar
  async remove(@Param('id') id: string): Promise<void> {
    return await this.categoriesService.remove(id);
  }
}
