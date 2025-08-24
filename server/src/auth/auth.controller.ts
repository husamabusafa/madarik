import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Res,
  Query,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { UserRole } from '@prisma/client';
import {
  LoginDto,
  AcceptInviteDto,
  InviteUserDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AuthResponseDto,
  InviteResponseDto,
  VerifyEmailDto,
} from './dto/auth.dto';
import { CurrentUser as ICurrentUser } from '../common/interfaces/user.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Throttle({ default: { limit: 5, ttl: 900000 } }) // 5 attempts per 15 minutes
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @CurrentUser() user: ICurrentUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ success: boolean; data: AuthResponseDto; message: string }> {
    const result = await this.authService.login(user);
    
    // Set HTTP-only cookie
    response.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    return {
      success: true,
      data: result,
      message: 'Login successful',
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token');
    return {
      success: true,
      message: 'Logout successful',
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('invite')
  async inviteUser(
    @Body() inviteUserDto: InviteUserDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<{ success: boolean; data: InviteResponseDto; message: string }> {
    const result = await this.authService.inviteUser(
      user.id,
      inviteUserDto.email,
      inviteUserDto.role,
    );
    
    return {
      success: true,
      data: result,
      message: 'Invitation sent successfully',
    };
  }

  @Post('accept-invite')
  async acceptInvite(
    @Body() acceptInviteDto: AcceptInviteDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ success: boolean; data: AuthResponseDto; message: string }> {
    const result = await this.authService.acceptInvitation(
      acceptInviteDto.token,
      acceptInviteDto.password,
      acceptInviteDto.preferredLocale,
    );
    
    // Set HTTP-only cookie
    response.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    return {
      success: true,
      data: result,
      message: 'Account created successfully',
    };
  }

  @Throttle({ default: { limit: 3, ttl: 3600000 } }) // 3 attempts per hour
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const result = await this.authService.requestPasswordReset(forgotPasswordDto.email);
    
    return {
      success: true,
      message: result.message,
    };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const result = await this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.password,
    );
    
    return {
      success: true,
      message: result.message,
    };
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() body: VerifyEmailDto) {
    const result = await this.authService.verifyEmailToken(body.token);
    return { success: true, message: result.message };
  }

  @UseGuards(JwtAuthGuard)
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(@CurrentUser() user: ICurrentUser) {
    await this.authService.issueAndSendEmailVerification(user.id, user.email);
    return { success: true, message: 'Verification email resent' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() user: ICurrentUser) {
    return {
      success: true,
      data: user,
      message: 'User profile retrieved',
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('invitations')
  async getInvitations(@Query() paginationDto: PaginationDto) {
    const result = await this.authService.getUserInvitations(
      paginationDto.page,
      paginationDto.limit,
    );
    
    return {
      success: true,
      data: result.invitations,
      pagination: result.pagination,
      message: 'Invitations retrieved',
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('invitations/:id/revoke')
  @HttpCode(HttpStatus.OK)
  async revokeInvitation(@Param('id') id: string) {
    const result = await this.authService.revokeInvitation(id);
    
    return {
      success: true,
      message: result.message,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('invitations/:id/resend')
  @HttpCode(HttpStatus.OK)
  async resendInvitation(
    @Param('id') id: string,
    @CurrentUser() user: ICurrentUser,
  ) {
    const result = await this.authService.resendInvitation(id, user.id);
    
    return {
      success: true,
      message: result.message,
    };
  }
}
