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
} from '@nestjs/common';
import { OrdenesService } from './ordenes.service';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { UpdateOrdenDto } from './dto/update-orden.dto';
import { ChangeEstadoOrdenDto } from './dto/change-estado-orden.dto';
import { FilterOrdenesDto } from './dto/filter-ordenes.dto';
import { Orden } from './orden.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@Controller('ordenes')
@UseGuards(JwtAuthGuard)
export class OrdenesController {
  constructor(private readonly ordenesService: OrdenesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrdenDto: CreateOrdenDto): Promise<Orden> {
    return await this.ordenesService.create(createOrdenDto);
  }

  @Get()
  async findAll(@Query() filterDto: FilterOrdenesDto): Promise<Orden[]> {
    return await this.ordenesService.findAll(filterDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Orden> {
    return await this.ordenesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrdenDto: UpdateOrdenDto,
  ): Promise<Orden> {
    return await this.ordenesService.update(id, updateOrdenDto);
  }

  @Patch(':id/estado')
  async changeEstado(
    @Param('id') id: string,
    @Body() changeEstadoDto: ChangeEstadoOrdenDto,
  ): Promise<Orden> {
    return await this.ordenesService.changeEstado(id, changeEstadoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return await this.ordenesService.remove(id);
  }
}
