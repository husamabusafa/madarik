import { IsEnum, IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole, Locale } from '@prisma/client';

export class UpdateUserRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}

export class UpdateUserStatusDto {
  @IsBoolean()
  isActive: boolean;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsEnum(Locale)
  preferredLocale?: Locale;
}

export class SearchUsersDto {
  @IsString()
  @MinLength(1)
  q: string;
}

export class UserResponseDto {
  id: string;
  email: string;
  role: UserRole;
  preferredLocale: Locale;
  isActive: boolean;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  lastLoginAt: Date | null;
}

export class UserStatsDto {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminUsers: number;
  managerUsers: number;
}

export class UserForAssignmentDto {
  id: string;
  email: string;
  role: UserRole;
}
