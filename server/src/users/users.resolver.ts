import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserStats, CreateUserInput, UpdateUserInput } from './dto/user.dto';
import { CurrentUser } from '../common/decorators/auth.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User)
  async user(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Query(() => UserStats)
  async userStats(): Promise<UserStats> {
    return this.usersService.getUserStats();
  }

  @Query(() => User, { nullable: true })
  async me(@CurrentUser() user: User): Promise<User | null> {
    return user || null;
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput): Promise<User> {
    return this.usersService.create(input);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateUserInput,
  ): Promise<User> {
    return this.usersService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    await this.usersService.delete(id);
    return true;
  }

  @Mutation(() => User)
  async verifyUserEmail(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.usersService.verifyEmail(id);
  }
}
