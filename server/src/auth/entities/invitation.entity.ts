import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { UserRole, InviteStatus } from '@prisma/client';
import { User } from '../../users/entities/user.entity';

registerEnumType(InviteStatus, {
  name: 'InviteStatus',
});

@ObjectType()
export class Invitation {
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
  expiresAt: Date;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  acceptedAt?: Date;

  @Field({ nullable: true })
  acceptedUserId?: string;

  // Relations
  @Field(() => User)
  inviter: User;

  @Field(() => User, { nullable: true })
  acceptedUser?: User;

  // Token is intentionally not exposed in GraphQL for security
}
