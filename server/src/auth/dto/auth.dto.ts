import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole, Locale } from '@prisma/client';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class AcceptInviteDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsEnum(Locale)
  preferredLocale?: Locale;
}

export class InviteUserDto {
  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class VerifyEmailDto {
  @IsString()
  token: string;
}

export class AuthResponseDto {
  token: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
    preferredLocale: Locale;
    isActive: boolean;
  };
}

export class InviteResponseDto {
  id: string;
  email: string;
  role: UserRole;
  expiresAt: Date;
}
