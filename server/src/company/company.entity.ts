import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { MemberRole } from '@prisma/client';

// Register the MemberRole enum for GraphQL
registerEnumType(MemberRole, {
  name: 'MemberRole',
  description: 'Company member roles',
});

@ObjectType()
export class Company {
  @Field(() => ID)
  id: string;

  @Field()
  ownerUserId: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  logoUrl?: string;

  @Field()
  country: string;

  @Field()
  city: string;

  @Field({ nullable: true })
  publicEmail?: string;

  @Field({ nullable: true })
  publicPhone?: string;

  @Field({ nullable: true })
  website?: string;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class CompanyMember {
  @Field()
  companyId: string;

  @Field()
  userId: string;

  @Field(() => MemberRole)
  role: MemberRole;

  @Field()
  addedAt: Date;
}

