import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '@prisma/client';

@InputType()
export class InviteUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field(() => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  message?: string;
}

@InputType()
export class AcceptInvitationInput {
  @Field()
  @IsString()
  token: string;

  @Field()
  @IsString()
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  preferredLocale?: string;
}
