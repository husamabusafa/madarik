import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UserRole, Locale } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          role: true,
          preferredLocale: true,
          isActive: true,
          emailVerifiedAt: true,
          createdAt: true,
          lastLoginAt: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        preferredLocale: true,
        isActive: true,
        emailVerifiedAt: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUserRole(userId: string, role: UserRole) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        role: true,
        preferredLocale: true,
        isActive: true,
        emailVerifiedAt: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    return updatedUser;
  }

  async toggleUserStatus(userId: string, isActive: boolean) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: {
        id: true,
        email: true,
        role: true,
        preferredLocale: true,
        isActive: true,
        emailVerifiedAt: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    return updatedUser;
  }

  async updateProfile(
    userId: string,
    updates: {
      preferredLocale?: Locale;
    },
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updates,
      select: {
        id: true,
        email: true,
        role: true,
        preferredLocale: true,
        isActive: true,
        emailVerifiedAt: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    return updatedUser;
  }

  async getUserStats() {
    const [totalUsers, activeUsers, adminUsers, managerUsers] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { role: UserRole.ADMIN } }),
      this.prisma.user.count({ where: { role: UserRole.MANAGER } }),
    ]);

    return {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      adminUsers,
      managerUsers,
    };
  }

  async searchUsers(query: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const whereClause = {
      OR: [
        { email: { contains: query, mode: 'insensitive' as const } },
      ],
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          role: true,
          preferredLocale: true,
          isActive: true,
          emailVerifiedAt: true,
          createdAt: true,
          lastLoginAt: true,
        },
      }),
      this.prisma.user.count({ where: whereClause }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUsersForAssignment() {
    const users = await this.prisma.user.findMany({
      where: {
        isActive: true,
        emailVerifiedAt: { not: null },
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
      orderBy: { email: 'asc' },
    });

    return users;
  }
}
