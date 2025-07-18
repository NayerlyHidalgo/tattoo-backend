import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user.isActive) {
      throw new UnauthorizedException('Usuario desactivado');
    }

    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role,
      username: user.username 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    };
  }

  async register(registerDto: RegisterDto) {
    try {
      const user = await this.usersService.create(registerDto);
      
      // Retornar sin el password
      const { password, ...result } = user;
      return result;
    } catch (error) {
      if (error.code === '23505') { // PostgreSQL unique violation
        throw new ConflictException('El email ya está registrado');
      }
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.usersService.findByEmail(email);
      
      if (user && await bcrypt.compare(password, user.password)) {
        return user;
      }
      
      throw new UnauthorizedException('Credenciales inválidas');
    } catch (error) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }

  async validateJwtPayload(payload: any): Promise<User> {
    console.log('🔍 validateJwtPayload called with payload:', payload);
    try {
      const user = await this.usersService.findOne(payload.sub);
      console.log('👤 User found:', user ? user.email : 'null');
      
      if (!user || !user.isActive) {
        console.log('❌ User validation failed - user:', !!user, 'isActive:', user?.isActive);
        throw new UnauthorizedException('Usuario no válido');
      }
      
      console.log('✅ User validation successful');
      return user;
    } catch (error) {
      console.log('❌ Error in validateJwtPayload:', error.message);
      throw new UnauthorizedException('Usuario no válido');
    }
  }
}
