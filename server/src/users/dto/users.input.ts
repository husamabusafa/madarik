import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { UserRole, Locale } from '@prisma/client';

@InputType()
export class UpdateUserRoleInput {
  @Field(() => UserRole)
  role: UserRole;
}

@InputType()
export class UpdateUserStatusInput {
  @Field()
  isActive: boolean;
}

@InputType()
export class UpdateProfileInput {
  @Field(() => Locale, { nullable: true })
  preferredLocale?: Locale;
}

@ObjectType()
export class UserStatsType {
  @Field()
  totalUsers: number;

  @Field()
  activeUsers: number;

  @Field()
  inactiveUsers: number;

  @Field()
  adminUsers: number;

  @Field()
  managerUsers: number;
}

@InputType()
export class SearchUsersInput {
  @Field()
  query: string;

  @Field({ nullable: true })
  page?: number;

  @Field({ nullable: true })
  limit?: number;
}
