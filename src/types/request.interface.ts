import { Request } from 'express';
import { User } from '../users/user.entity';

// Extender el Request de Express para incluir el usuario autenticado
export interface AuthenticatedRequest extends Request {
  user: User;
}

// Tipos para los guards
export interface RequestWithUser extends Request {
  user?: User;
}
