import { Resolver, Mutation, Query, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Invitation } from './entities/invitation.entity';
import { User } from '../users/entities/user.entity';
import { InviteUserInput, AcceptInvitationInput } from './dto/invitation.input';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { CurrentUser as CurrentUserDecorator } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../common/interfaces/user.interface';

@Resolver(() => Invitation)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Invitation)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async inviteUser(
    @Args('input') input: InviteUserInput,
    @CurrentUserDecorator() user: CurrentUser,
  ): Promise<Invitation> {
    const result = await this.authService.inviteUser(
      user.id,
      input.email,
      input.role,
    );
    
    // Convert the result to match the Invitation entity
    return {
      id: result.id,
      email: result.email,
      invitedRole: result.role,
      inviterUserId: user.id,
      status: 'PENDING' as any,
      expiresAt: result.expiresAt,
      createdAt: new Date(),
      inviter: null, // Will be resolved by field resolver if needed
    } as Invitation;
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async resendInvitation(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUserDecorator() user: CurrentUser,
  ): Promise<string> {
    const result = await this.authService.resendInvitation(id, user.id);
    return result.message;
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async revokeInvitation(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<string> {
    const result = await this.authService.revokeInvitation(id);
    return result.message;
  }

  @Query(() => [Invitation])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async invitations(): Promise<Invitation[]> {
    const invitations = await this.authService.getInvitations();
    // Map the database result to match GraphQL entity structure
    return invitations.map(invitation => ({
      ...invitation,
      inviter: invitation.inviter as any, // Type assertion for GraphQL compatibility
      acceptedUser: invitation.acceptedUser as any,
    })) as Invitation[];
  }

  @Mutation(() => User)
  async acceptInvitation(
    @Args('input') input: AcceptInvitationInput,
  ): Promise<User> {
    const result = await this.authService.acceptInvitation(
      input.token,
      input.password,
      input.preferredLocale as any,
    );
    
    // Return a complete user object with all required fields
    return {
      ...result.user,
      createdAt: new Date(),
    } as User;
  }
}
