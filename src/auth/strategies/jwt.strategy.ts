import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../../types/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    const secret = configService.get<string>('JWT_SECRET') || 'your-secret-key';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
    console.log('🔑 JWT Strategy initialized with secret:', secret);
  }

  async validate(payload: JwtPayload) {
    console.log('🔍 JWT Strategy validate called with payload:', payload);
    try {
      const user = await this.authService.validateJwtPayload(payload);
      console.log('✅ JWT Strategy validation successful:', user ? user.email : 'null');
      return user;
    } catch (error) {
      console.log('❌ JWT Strategy validation failed:', error.message);
      throw error;
    }
  }
}
