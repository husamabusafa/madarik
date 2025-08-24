import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { UserRole, Locale } from '@prisma/client';

registerEnumType(UserRole, {
  name: 'UserRole',
});

registerEnumType(Locale, {
  name: 'Locale',
});

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  emailVerifiedAt?: Date;

  @Field({ nullable: true })
  lastLoginAt?: Date;

  @Field()
  createdAt: Date;

  @Field(() => Locale)
  preferredLocale: Locale;

  // Don't expose password in GraphQL
  // password field is intentionally omitted
}
