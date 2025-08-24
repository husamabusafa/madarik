import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { UserInvite, CreateInviteInput, AcceptInviteInput } from './dto/invite.dto';
import { User } from '../users/dto/user.dto';
import { CurrentUser } from '../common/decorators/auth.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver(() => UserInvite)
export class InvitesResolver {
  constructor(private invitesService: InvitesService) {}

  @Query(() => [UserInvite])
  @UseGuards(JwtAuthGuard)
  async invites(): Promise<UserInvite[]> {
    return this.invitesService.findAll();
  }

  @Query(() => UserInvite)
  @UseGuards(JwtAuthGuard)
  async invite(@Args('id', { type: () => ID }) id: string): Promise<UserInvite> {
    return this.invitesService.findById(id);
  }

  @Query(() => UserInvite)
  async inviteByToken(@Args('token') token: string): Promise<UserInvite> {
    return this.invitesService.findByToken(token);
  }

  @Mutation(() => UserInvite)
  @UseGuards(JwtAuthGuard)
  async createInvite(
    @Args('input') input: CreateInviteInput,
    @CurrentUser() user: User,
  ): Promise<UserInvite> {
    return this.invitesService.create(input, user.id);
  }

  @Mutation(() => User)
  async acceptInvite(@Args('input') input: AcceptInviteInput): Promise<User> {
    return this.invitesService.acceptInvite(input);
  }

  @Mutation(() => UserInvite)
  @UseGuards(JwtAuthGuard)
  async resendInvite(@Args('id', { type: () => ID }) id: string): Promise<UserInvite> {
    return this.invitesService.resendInvite(id);
  }

  @Mutation(() => UserInvite)
  @UseGuards(JwtAuthGuard)
  async revokeInvite(@Args('id', { type: () => ID }) id: string): Promise<UserInvite> {
    return this.invitesService.revokeInvite(id);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteInvite(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    await this.invitesService.deleteInvite(id);
    return true;
  }
}
