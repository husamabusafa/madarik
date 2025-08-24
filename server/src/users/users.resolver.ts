import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser as CurrentUserDecorator } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../common/interfaces/user.interface';
import { UpdateUserRoleInput, UpdateUserStatusInput, UpdateProfileInput, UserStatsType } from './dto/users.input';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async users(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User, { nullable: true })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async user(@Args('id', { type: () => ID }) id: string): Promise<User | null> {
    return this.usersService.findById(id);
  }

  @Query(() => User)
  async me(@CurrentUserDecorator() user: CurrentUser): Promise<User> {
    return this.usersService.findById(user.id);
  }

  @Query(() => [User])
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async usersForAssignment(): Promise<User[]> {
    return this.usersService.findActiveUsers();
  }

  @Query(() => UserStatsType)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async userStats(): Promise<UserStatsType> {
    return this.usersService.getUserStats();
  }

  // Mutations
  @Mutation(() => User)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateUserRole(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateUserRoleInput,
  ): Promise<User> {
    return this.usersService.updateUserRole(id, input.role);
  }

  @Mutation(() => User)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateUserStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateUserStatusInput,
  ): Promise<User> {
    return this.usersService.toggleUserStatus(id, input.isActive);
  }

  @Mutation(() => User)
  async updateProfile(
    @CurrentUserDecorator() user: CurrentUser,
    @Args('input') input: UpdateProfileInput,
  ): Promise<User> {
    return this.usersService.updateProfile(user.id, input);
  }

  @Mutation(() => User)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateUserProfile(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateProfileInput,
  ): Promise<User> {
    return this.usersService.updateProfile(id, input);
  }
}
