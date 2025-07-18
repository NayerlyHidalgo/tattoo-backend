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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UserRole } from './enums/user-role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN) // Solo admins pueden crear usuarios
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN) // Solo admins pueden ver todos los usuarios
  async findAll(@Query('role') role?: UserRole): Promise<User[]> {
    if (role) {
      return await this.usersService.findByRole(role);
    }
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Get('email/:email')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN) // Solo admins pueden buscar por email
  async findByEmail(@Param('email') email: string): Promise<User> {
    return await this.usersService.findByEmail(email);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN) // Solo admins pueden eliminar usuarios
  async remove(@Param('id') id: string): Promise<void> {
    return await this.usersService.remove(id);
  }

  @Patch(':id/soft-delete')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN) // Solo admins pueden desactivar usuarios
  async softDelete(@Param('id') id: string): Promise<User> {
    return await this.usersService.softDelete(id);
  }

  @Patch(':id/activate')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN) // Solo admins pueden activar usuarios
  async activate(@Param('id') id: string): Promise<User> {
    return await this.usersService.activate(id);
  }

  @Patch(':id/verify-email')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN) // Solo admins pueden verificar emails
  async verifyEmail(@Param('id') id: string): Promise<User> {
    return await this.usersService.verifyEmail(id);
  }
}
