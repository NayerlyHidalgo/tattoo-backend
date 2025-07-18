import { UserRole } from '../users/enums/user-role.enum';

export interface JwtPayload {
  sub: string;        // user id (subject)
  email: string;
  username: string;
  role: UserRole;
  iat?: number;       // issued at
  exp?: number;       // expires at
}
