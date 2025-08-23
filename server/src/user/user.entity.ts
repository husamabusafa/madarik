import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Locale } from '@prisma/client';

// Register the Locale enum for GraphQL
registerEnumType(Locale, {
  name: 'Locale',
  description: 'Supported locales',
});

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  // Don't expose password hash in GraphQL
  passwordHash?: string;

  @Field({ nullable: true })
  emailVerifiedAt?: Date | null;

  @Field(() => Locale)
  preferredLocale: Locale;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  lastLoginAt?: Date | null;
}
