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
    const html = `
      <div>
        <p>You requested to reset your password. Click the link below to continue:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>This link will expire on ${expiresAt.toUTCString()}.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `;
    await this.mail.sendEmail({
      to: user.email,
      subject: 'Reset your password - Madarik',
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
