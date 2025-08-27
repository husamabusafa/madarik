import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsEnum, IsBoolean, IsString } from 'class-validator';
import { UserRole, Locale } from '../../common/enums';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field(() => Locale)
  preferredLocale: Locale;

  @Field(() => UserRole)
  role: UserRole;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  lastLoginAt?: Date;

  @Field({ nullable: true })
  emailVerifiedAt?: Date;
}

@ObjectType()
export class UserStats {
  @Field()
  totalUsers: number;

  @Field()
  activeUsers: number;

  @Field()
  adminUsers: number;

  @Field()
  managerUsers: number;
}

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  password: string;

  @Field(() => UserRole, { defaultValue: UserRole.MANAGER })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @Field(() => Locale, { defaultValue: Locale.EN })
  @IsEnum(Locale)
  @IsOptional()
  preferredLocale?: Locale;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field(() => UserRole, { nullable: true })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @Field(() => Locale, { nullable: true })
  @IsEnum(Locale)
  @IsOptional()
  preferredLocale?: Locale;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

@InputType()
export class UpdateUserRoleInput {
  @Field(() => UserRole)
  @IsEnum(UserRole)
  role: UserRole;
}

@InputType()
export class UpdateUserStatusInput {
  @Field()
  @IsBoolean()
  isActive: boolean;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  password: string;
}

@ObjectType()
export class AuthPayload {
  @Field()
  token: string;

  @Field(() => User)
  user: User;
}
