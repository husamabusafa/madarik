import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { PrismaService } from '../database/prisma.service';
import { EmailService } from '../email/email.service';
import { UserRole, InviteStatus, Locale } from '@prisma/client';
import { JwtPayload, CurrentUser } from '../common/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async validateUser(email: string, password: string): Promise<CurrentUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return null;
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      preferredLocale: user.preferredLocale,
      isActive: user.isActive,
    };
  }

  async login(user: CurrentUser) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      token: this.jwtService.sign(payload),
      user,
    };
  }

  async inviteUser(inviterUserId: string, email: string, role: UserRole) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if there's already a pending invite
    const existingInvite = await this.prisma.userInvite.findFirst({
      where: {
        email: email.toLowerCase(),
        status: InviteStatus.PENDING,
        expiresAt: { gt: new Date() },
      },
    });

    if (existingInvite) {
      throw new ConflictException('Pending invitation already exists for this email');
    }

    // Get inviter details
    const inviter = await this.prisma.user.findUnique({
      where: { id: inviterUserId },
      select: { email: true, role: true },
    });

    if (!inviter) {
      throw new BadRequestException('Inviter not found');
    }

    // Create invitation
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + parseInt(this.configService.get('INVITE_EXPIRES_HOURS') || '168'));

    const invite = await this.prisma.userInvite.create({
      data: {
        email: email.toLowerCase(),
        invitedRole: role,
        inviterUserId,
        token,
        expiresAt,
        status: InviteStatus.PENDING,
      },
    });

    // Send invitation email
    const inviteUrl = `${this.configService.get('CLIENT_URL')}/auth/accept-invite?token=${token}`;
    await this.emailService.sendInvitationEmail(
      email,
      inviter.email,
      role,
      inviteUrl,
    );

    return {
      id: invite.id,
      email: invite.email,
      role: invite.invitedRole,
      expiresAt: invite.expiresAt,
    };
  }

  async acceptInvitation(token: string, password: string, preferredLocale: Locale = Locale.EN) {
    // Find invitation
    const invite = await this.prisma.userInvite.findUnique({
      where: { token },
      include: { inviter: true },
    });

    if (!invite) {
      throw new BadRequestException('Invalid invitation token');
    }

    if (invite.status !== InviteStatus.PENDING) {
      throw new BadRequestException('Invitation has already been used or revoked');
    }

    if (new Date() > invite.expiresAt) {
      // Mark as expired
      await this.prisma.userInvite.update({
        where: { id: invite.id },
        data: { status: InviteStatus.EXPIRED },
      });
      throw new BadRequestException('Invitation has expired');
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: invite.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, parseInt(this.configService.get('BCRYPT_ROUNDS') || '12'));

    // Create user and update invitation in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: invite.email,
          passwordHash,
          role: invite.invitedRole,
          preferredLocale,
          emailVerifiedAt: new Date(), // Auto-verify email for invited users
          isActive: true,
        },
      });

      // Update invitation
      await tx.userInvite.update({
        where: { id: invite.id },
        data: {
          status: InviteStatus.ACCEPTED,
          acceptedAt: new Date(),
          acceptedUserId: user.id,
        },
      });

      return user;
    });

    // Generate JWT token
    const payload: JwtPayload = {
      sub: result.id,
      email: result.email,
      role: result.role,
    };

    const jwtToken = this.jwtService.sign(payload);

    return {
      token: jwtToken,
      user: {
        id: result.id,
        email: result.email,
        role: result.role,
        preferredLocale: result.preferredLocale,
        isActive: result.isActive,
      },
    };
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if email exists or not
      return { message: 'If the email exists, a reset link has been sent' };
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    // Delete any existing password reset tokens for this user
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Create new password reset token
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // Send reset email
    const resetUrl = `${this.configService.get('CLIENT_URL')}/auth/reset-password?token=${token}`;
    await this.emailService.sendPasswordResetEmail(user.email, resetUrl);

    return { message: 'If the email exists, a reset link has been sent' };
  }

  async createUserWithVerification(email: string, password: string, preferredLocale: Locale = Locale.EN) {
    // Invite-only in BRD; method provided for seed/admin-created accounts only
    const existingUser = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, parseInt(this.configService.get('BCRYPT_ROUNDS') || '12'));
    const user = await this.prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        preferredLocale,
        role: 'MANAGER',
        isActive: true,
      },
    });

    await this.issueAndSendEmailVerification(user.id, user.email);
    return { id: user.id, email: user.email };
  }

  async issueAndSendEmailVerification(userId: string, email: string) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.emailVerificationToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });

    const verifyUrl = `${this.configService.get('CLIENT_URL')}/auth/verify-email?token=${token}`;
    await this.emailService.sendEmailVerification(email, verifyUrl);
    return { token, expiresAt };
  }

  async verifyEmailToken(token: string) {
    const record = await this.prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!record) {
      throw new BadRequestException('Invalid verification token');
    }
    if (record.usedAt) {
      throw new BadRequestException('Verification token already used');
    }
    if (new Date() > record.expiresAt) {
      throw new BadRequestException('Verification token expired');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: record.userId },
        data: { emailVerifiedAt: new Date() },
      });
      await tx.emailVerificationToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      });
    });

    return { message: 'Email verified successfully' };
  }

  async resetPassword(token: string, newPassword: string) {
    // Find reset token
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (resetToken.usedAt) {
      throw new BadRequestException('Reset token has already been used');
    }

    if (new Date() > resetToken.expiresAt) {
      throw new BadRequestException('Reset token has expired');
    }

    if (!resetToken.user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, parseInt(this.configService.get('BCRYPT_ROUNDS') || '12'));

    // Update password and mark token as used in a transaction
    await this.prisma.$transaction(async (tx) => {
      // Update user password
      await tx.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      });

      // Mark token as used
      await tx.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      });
    });

    return { message: 'Password has been reset successfully' };
  }

  async getUserInvitations(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [invitations, total] = await Promise.all([
      this.prisma.userInvite.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          inviter: {
            select: { email: true },
          },
          acceptedUser: {
            select: { email: true },
          },
        },
      }),
      this.prisma.userInvite.count(),
    ]);

    return {
      invitations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async revokeInvitation(inviteId: string) {
    const invite = await this.prisma.userInvite.findUnique({
      where: { id: inviteId },
    });

    if (!invite) {
      throw new BadRequestException('Invitation not found');
    }

    if (invite.status !== InviteStatus.PENDING) {
      throw new BadRequestException('Can only revoke pending invitations');
    }

    await this.prisma.userInvite.update({
      where: { id: inviteId },
      data: { status: InviteStatus.REVOKED },
    });

    return { message: 'Invitation revoked successfully' };
  }

  async resendInvitation(inviteId: string, inviterUserId: string) {
    const invite = await this.prisma.userInvite.findUnique({
      where: { id: inviteId },
    });

    if (!invite) {
      throw new BadRequestException('Invitation not found');
    }

    if (invite.status !== InviteStatus.PENDING) {
      throw new BadRequestException('Can only resend pending invitations');
    }

    // Get inviter details
    const inviter = await this.prisma.user.findUnique({
      where: { id: inviterUserId },
      select: { email: true },
    });

    if (!inviter) {
      throw new BadRequestException('Inviter not found');
    }

    // Generate new token and extend expiry
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + parseInt(this.configService.get('INVITE_EXPIRES_HOURS') || '168'));

    await this.prisma.userInvite.update({
      where: { id: inviteId },
      data: { token, expiresAt },
    });

    // Send invitation email
    const inviteUrl = `${this.configService.get('CLIENT_URL')}/auth/accept-invite?token=${token}`;
    await this.emailService.sendInvitationEmail(
      invite.email,
      inviter.email,
      invite.invitedRole,
      inviteUrl,
    );

    return { message: 'Invitation resent successfully' };
  }
}
