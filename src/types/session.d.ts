import { UserRole } from '../users/enums/user-role.enum';

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      email: string;
      username: string;
      firstName?: string;
      lastName?: string;
      role: UserRole;
      isActive: boolean;
      profile?: string;
    };
    isAdmin?: boolean;
  }
}
