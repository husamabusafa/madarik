import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput, AuthPayload } from '../users/dto/user.dto';
import { ForgotPasswordInput, ResetPasswordInput, VerifyEmailInput } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/auth.decorator';
import { User } from '../users/dto/user.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput): Promise<AuthPayload> {
    return this.authService.login(input);
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Args('input') input: ForgotPasswordInput): Promise<boolean> {
    return this.authService.forgotPassword(input.email);
  }

  @Mutation(() => Boolean)
  async resetPassword(@Args('input') input: ResetPasswordInput): Promise<boolean> {
    return this.authService.resetPassword(input.token, input.password);
  }

  @Mutation(() => Boolean)
  async verifyEmail(@Args('input') input: VerifyEmailInput): Promise<boolean> {
    return this.authService.verifyEmailByToken(input.token);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async resendVerification(@CurrentUser() user: User): Promise<boolean> {
    return this.authService.resendVerification(user.id);
  }
}
