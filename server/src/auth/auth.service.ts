import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginInput, AuthPayload } from '../users/dto/user.dto';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private mail: MailService,
    private config: ConfigService,
  ) {}

  async login(loginInput: LoginInput): Promise<AuthPayload> {
    const user = await this.usersService.findByEmail(loginInput.email);
    
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials or account inactive');
    }

    const isPasswordValid = await this.usersService.validatePassword(user, loginInput.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    return this.signForUser(user);
  }

  async validateUser(userId: string) {
    return this.usersService.findById(userId);
  }

  signForUser(user: any): AuthPayload {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    return { token, user };
  }

  async createEmailVerificationToken(userId: string) {
    const token = cryptoRandom();
    const expiresAt = addDays(new Date(), 2);
    await this.prisma.emailVerificationToken.create({
      data: { userId, token, expiresAt },
    });
    return token;
  }

  async resendVerification(userId: string): Promise<boolean> {
    // Optionally mark previous tokens expired/used, but not required
    const token = await this.createEmailVerificationToken(userId);
    const user = await this.usersService.findById(userId);

    const clientUrl = this.config.get<string>('CLIENT_URL') || 'http://localhost:5100';
    const verifyUrl = `${clientUrl}/auth/verify-email?token=${encodeURIComponent(token)}`;
    const html = `
      <div>
        <p>Please verify your email address by clicking the link below:</p>
        <p><a href="${verifyUrl}">Verify Email</a></p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `;
    await this.mail.sendEmail({
      to: user.email,
      subject: 'Verify your email - Madarik',
      html,
    });
    return true;
  }

  async verifyEmailByToken(token: string): Promise<boolean> {
    const record = await this.prisma.emailVerificationToken.findUnique({ where: { token } });
    if (!record) throw new NotFoundException('Invalid token');
    if (record.usedAt) throw new BadRequestException('Token already used');
    if (record.expiresAt < new Date()) throw new BadRequestException('Token expired');

    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: record.userId }, data: { emailVerifiedAt: new Date() } }),
      this.prisma.emailVerificationToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    ]);
    return true;
  }

  async forgotPassword(email: string): Promise<boolean> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return true; // do not reveal existence
    const token = cryptoRandom();
    const expiresAt = addDays(new Date(), 1);
    await this.prisma.passwordResetToken.create({ data: { userId: user.id, token, expiresAt } });

    const clientUrl = this.config.get<string>('CLIENT_URL') || 'http://localhost:5100';
    const resetUrl = `${clientUrl}/auth/reset-password?token=${encodeURIComponent(token)}`;
    const brand = this.config.get<string>('SITE_NAME') || 'Madarik';
    const html = `
      <div style="font-family: -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif; background:#0f172a; color:#e2e8f0; padding:24px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; margin:0 auto; background:#111827; border:1px solid #1f2937; border-radius:12px; overflow:hidden;">
          <tr>
            <td style="padding:24px 24px 8px 24px;">
              <div style="font-size:22px; font-weight:700; color:#f8fafc;">Reset your ${brand} password</div>
              <div style="margin-top:6px; font-size:14px; color:#94a3b8;">We received a request to reset your password</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;">
              <div style="margin-bottom:12px; color:#cbd5e1;">Click the button below to reset your password. This link is secure and will expire in 24 hours.</div>
              <a href="${resetUrl}" style="display:inline-block; background:#3b82f6; color:#0b1220; text-decoration:none; font-weight:600; padding:12px 18px; border-radius:10px;">Reset Password</a>
              <div style="margin-top:16px; font-size:12px; color:#94a3b8;">If the button doesn't work, copy and paste this link into your browser:</div>
              <div style="margin-top:6px; font-size:12px; color:#60a5fa; word-break:break-all;">${resetUrl}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 24px 24px; font-size:12px; color:#94a3b8;">
              This link expires on ${expiresAt.toUTCString()}. If you didn't request this password reset, you can safely ignore this email.
            </td>
          </tr>
        </table>
      </div>
    `;
    await this.mail.sendEmail({
      to: user.email,
      subject: `Reset your ${brand} password`,
      html,
    });

    return true;
  }

  async resetPassword(token: string, password: string): Promise<boolean> {
    const record = await this.prisma.passwordResetToken.findUnique({ where: { token } });
    if (!record) throw new NotFoundException('Invalid token');
    if (record.usedAt) throw new BadRequestException('Token already used');
    if (record.expiresAt < new Date()) throw new BadRequestException('Token expired');

    const passwordHash = await bcrypt.hash(password, 10);
    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
      this.prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    ]);
    return true;
  }

  async forgotPasswordAdmin(userId: string): Promise<boolean> {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    
    const token = cryptoRandom();
    const expiresAt = addDays(new Date(), 1);
    await this.prisma.passwordResetToken.create({ data: { userId: user.id, token, expiresAt } });

    const clientUrl = this.config.get<string>('CLIENT_URL') || 'http://localhost:5100';
    const resetUrl = `${clientUrl}/auth/reset-password?token=${encodeURIComponent(token)}`;
    const brand = this.config.get<string>('SITE_NAME') || 'Madarik';
    const html = `
      <div style="font-family: -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif; background:#0f172a; color:#e2e8f0; padding:24px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; margin:0 auto; background:#111827; border:1px solid #1f2937; border-radius:12px; overflow:hidden;">
          <tr>
            <td style="padding:24px 24px 8px 24px;">
              <div style="font-size:22px; font-weight:700; color:#f8fafc;">Password reset - ${brand}</div>
              <div style="margin-top:6px; font-size:14px; color:#94a3b8;">An administrator has initiated a password reset for your account</div>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 0 24px;">
              <div style="background:#0b1220; border:1px solid #1e293b; padding:16px; border-radius:10px; color:#cbd5e1;">⚠️ This password reset was initiated by an administrator. If you didn't expect this, please contact your system administrator immediately.</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;">
              <div style="margin-bottom:12px; color:#cbd5e1;">Click the button below to set a new password. This link is secure and will expire in 24 hours.</div>
              <a href="${resetUrl}" style="display:inline-block; background:#3b82f6; color:#0b1220; text-decoration:none; font-weight:600; padding:12px 18px; border-radius:10px;">Set New Password</a>
              <div style="margin-top:16px; font-size:12px; color:#94a3b8;">If the button doesn't work, copy and paste this link into your browser:</div>
              <div style="margin-top:6px; font-size:12px; color:#60a5fa; word-break:break-all;">${resetUrl}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 24px 24px; font-size:12px; color:#94a3b8;">
              This link expires on ${expiresAt.toUTCString()}.
            </td>
          </tr>
        </table>
      </div>
    `;
    await this.mail.sendEmail({
      to: user.email,
      subject: `Password reset initiated by administrator - ${brand}`,
      html,
    });

    return true;
  }

}

// helpers
function cryptoRandom(): string {
  const { randomBytes } = require('crypto');
  return randomBytes(32).toString('hex');
}
function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
