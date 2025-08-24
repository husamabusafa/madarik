import { UserRole, Locale } from '@prisma/client';

export interface JwtPayload {
  sub: string; // user ID
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface CurrentUser {
  id: string;
  email: string;
  role: UserRole;
  preferredLocale: Locale;
  isActive: boolean;
}
