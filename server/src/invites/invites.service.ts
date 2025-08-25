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
    const html = `
      <div>
        <p>You have been invited to join Madarik as ${invite.invitedRole}.</p>
        <p>Click the link below to accept the invitation and set your password:</p>
        <p><a href="${acceptUrl}">Accept Invitation</a></p>
        <p>This link expires on ${expiresAt.toUTCString()}.</p>
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
    const html = `
      <div>
        <p>This is a reminder to join Madarik.</p>
        <p>Click the link below to accept the invitation and set your password:</p>
        <p><a href="${acceptUrl}">Accept Invitation</a></p>
        <p>This link expires on ${expiresAt.toUTCString()}.</p>
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
