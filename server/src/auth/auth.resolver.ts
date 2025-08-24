import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput, AuthPayload } from '../users/dto/user.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput): Promise<AuthPayload> {
    return this.authService.login(input);
  }
}
