import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsEnum, IsString } from 'class-validator';
import { UserRole, InviteStatus } from '../../common/enums';
import { User } from '../../users/dto/user.dto';

@ObjectType()
export class UserInvite {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field(() => UserRole)
  invitedRole: UserRole;

  @Field()
  inviterUserId: string;

  @Field(() => InviteStatus)
  status: InviteStatus;

  @Field()
  token: string;

  @Field()
  expiresAt: Date;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  acceptedAt?: Date;

  @Field({ nullable: true })
  acceptedUserId?: string;

  @Field(() => User)
  inviter: User;

  @Field(() => User, { nullable: true })
  acceptedUser?: User;
}

@InputType()
export class CreateInviteInput {
  @Field()
  @IsEmail()
  email: string;

  @Field(() => UserRole, { defaultValue: UserRole.MANAGER })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  message?: string;
}

@InputType()
export class AcceptInviteInput {
  @Field()
  @IsString()
  token: string;

  @Field()
  @IsString()
  password: string;
}
