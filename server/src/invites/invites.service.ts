import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { UsersService } from '../users/users.service';
import { CreateInviteInput, AcceptInviteInput } from './dto/invite.dto';
import { InviteStatus } from '../common/enums';
import * as crypto from 'crypto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class InvitesService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private mail: MailService,
    private config: ConfigService,
  ) {}

  async findAll() {
    return this.prisma.userInvite.findMany({
      include: {
        inviter: true,
        acceptedUser: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const invite = await this.prisma.userInvite.findUnique({
      where: { id },
      include: {
        inviter: true,
        acceptedUser: true,
      },
    });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    return invite;
  }

  async findByToken(token: string) {
    const invite = await this.prisma.userInvite.findUnique({
      where: { token },
      include: {
        inviter: true,
        acceptedUser: true,
      },
    });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    return invite;
  }

  async create(data: CreateInviteInput, inviterUserId: string) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if there's already a pending invite
    const existingInvite = await this.prisma.userInvite.findFirst({
      where: {
        email: data.email,
        status: InviteStatus.PENDING,
      },
    });

    if (existingInvite) {
      throw new ConflictException('Pending invite already exists for this email');
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const invite = await this.prisma.userInvite.create({
      data: {
        email: data.email,
        invitedRole: data.role || 'MANAGER',
        inviterUserId,
        token,
        expiresAt,
      },
      include: {
        inviter: true,
        acceptedUser: true,
      },
    });

    // Send invite email
    const clientUrl = this.config.get<string>('CLIENT_URL') || 'http://localhost:5100';
    const acceptUrl = `${clientUrl}/auth/accept-invite?token=${encodeURIComponent(token)}`;
    const brand = this.config.get<string>('SITE_NAME') || 'Madarik';
    const customMessage = data.message?.trim();
    const html = `
      <div style="font-family: -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif; background:#0f172a; color:#e2e8f0; padding:24px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; margin:0 auto; background:#111827; border:1px solid #1f2937; border-radius:12px; overflow:hidden;">
          <tr>
            <td style="padding:24px 24px 8px 24px;">
              <div style="font-size:22px; font-weight:700; color:#f8fafc;">You're invited to ${brand}</div>
              <div style="margin-top:6px; font-size:14px; color:#94a3b8;">Role: <strong style="color:#c7d2fe;">${invite.invitedRole}</strong></div>
            </td>
          </tr>
          ${customMessage ? `
          <tr>
            <td style="padding:8px 24px 0 24px;">
              <div style="background:#0b1220; border:1px solid #1e293b; padding:16px; border-radius:10px; color:#cbd5e1; white-space:pre-wrap;">${customMessage.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
            </td>
          </tr>` : ''}
          <tr>
            <td style="padding:24px;">
              <div style="margin-bottom:12px; color:#cbd5e1;">Click the button below to accept the invitation and set your password.</div>
              <a href="${acceptUrl}" style="display:inline-block; background:#3b82f6; color:#0b1220; text-decoration:none; font-weight:600; padding:12px 18px; border-radius:10px;">Accept Invitation</a>
              <div style="margin-top:16px; font-size:12px; color:#94a3b8;">If the button doesn't work, copy and paste this link into your browser:</div>
              <div style="margin-top:6px; font-size:12px; color:#60a5fa; word-break:break-all;">${acceptUrl}</div>
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
    try {
      await this.mail.sendEmail({
        to: data.email,
        subject: 'Your invitation to Madarik',
        html,
      });
    } catch (err) {
      // Do not block invite creation on email errors
      console.warn('Invite email send failed (continuing):', err);
    }

    return invite;
  }

  async acceptInvite(data: AcceptInviteInput) {
    const invite = await this.findByToken(data.token);

    if (invite.status !== InviteStatus.PENDING) {
      throw new BadRequestException('Invite is not pending');
    }

    if (invite.expiresAt < new Date()) {
      // Mark as expired
      await this.prisma.userInvite.update({
        where: { id: invite.id },
        data: { status: InviteStatus.EXPIRED },
      });
      throw new BadRequestException('Invite has expired');
    }

    // Create the user
    const user = await this.usersService.create({
      email: invite.email,
      password: data.password,
      role: invite.invitedRole,
    });

    // Update invite status
    await this.prisma.userInvite.update({
      where: { id: invite.id },
      data: {
        status: InviteStatus.ACCEPTED,
        acceptedAt: new Date(),
        acceptedUserId: user.id,
      },
    });

    return user;
  }

  async resendInvite(id: string) {
    const invite = await this.findById(id);

    if (invite.status !== InviteStatus.PENDING) {
      throw new BadRequestException('Can only resend pending invites');
    }

    // Generate new token and extend expiry
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const updated = await this.prisma.userInvite.update({
      where: { id },
      data: {
        token,
        expiresAt,
      },
      include: {
        inviter: true,
        acceptedUser: true,
      },
    });

    // Send invite email again with new token
    const clientUrl = this.config.get<string>('CLIENT_URL') || 'http://localhost:5100';
    const acceptUrl = `${clientUrl}/auth/accept-invite?token=${encodeURIComponent(token)}`;
    const brand = this.config.get<string>('SITE_NAME') || 'Madarik';
    const html = `
      <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif; background:#0f172a; color:#e2e8f0; padding:24px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; margin:0 auto; background:#111827; border:1px solid #1f2937; border-radius:12px; overflow:hidden;">
          <tr>
            <td style="padding:24px 24px 8px 24px;">
              <div style="font-size:20px; font-weight:700; color:#f8fafc;">Reminder: your ${brand} invitation</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;">
              <div style="margin-bottom:12px; color:#cbd5e1;">Click the button below to accept the invitation and set your password.</div>
              <a href="${acceptUrl}" style="display:inline-block; background:#3b82f6; color:#0b1220; text-decoration:none; font-weight:600; padding:12px 18px; border-radius:10px;">Accept Invitation</a>
              <div style="margin-top:16px; font-size:12px; color:#94a3b8;">If the button doesn't work, copy and paste this link into your browser:</div>
              <div style="margin-top:6px; font-size:12px; color:#60a5fa; word-break:break-all;">${acceptUrl}</div>
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
    try {
      await this.mail.sendEmail({
        to: invite.email,
        subject: 'Invitation reminder to Madarik',
        html,
      });
    } catch (err) {
      // Do not block invite resend on email errors
      console.warn('Resend invite email failed (continuing):', err);
    }

    return updated;
  }

  async revokeInvite(id: string) {
    const invite = await this.findById(id);

    if (invite.status !== InviteStatus.PENDING) {
      throw new BadRequestException('Can only revoke pending invites');
    }

    return this.prisma.userInvite.update({
      where: { id },
      data: { status: InviteStatus.REVOKED },
      include: {
        inviter: true,
        acceptedUser: true,
      },
    });
  }

  async deleteInvite(id: string) {
    await this.findById(id);
    
    return this.prisma.userInvite.delete({
      where: { id },
    });
  }

  async cleanupExpiredInvites() {
    return this.prisma.userInvite.updateMany({
      where: {
        status: InviteStatus.PENDING,
        expiresAt: { lt: new Date() },
      },
      data: { status: InviteStatus.EXPIRED },
    });
  }
}
