import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Company, MemberRole } from '@prisma/client';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Company | null> {
    return this.prisma.company.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string): Promise<Company | null> {
    return this.prisma.company.findUnique({
      where: { slug },
    });
  }

  async create(data: {
    name: string;
    slug: string;
    country: string;
    city: string;
    ownerUserId: string;
    logoUrl?: string;
    publicEmail?: string;
    publicPhone?: string;
    website?: string;
  }): Promise<Company> {
    // Check if slug is already taken
    const existingCompany = await this.findBySlug(data.slug);
    if (existingCompany) {
      throw new BadRequestException('Company slug already exists');
    }

    // Create company and add owner as member
    return this.prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: data.name,
          slug: data.slug,
          country: data.country,
          city: data.city,
          ownerUserId: data.ownerUserId,
          logoUrl: data.logoUrl,
          publicEmail: data.publicEmail,
          publicPhone: data.publicPhone,
          website: data.website,
        },
      });

      // Add owner as company member
      await tx.companyMember.create({
        data: {
          companyId: company.id,
          userId: data.ownerUserId,
          role: MemberRole.OWNER,
        },
      });

      return company;
    });
  }

  async getUserCompanies(userId: string): Promise<Company[]> {
    const memberships = await this.prisma.companyMember.findMany({
      where: { userId },
      include: { company: true },
    });

    return memberships.map(membership => membership.company);
  }

  async getUserRole(userId: string, companyId: string): Promise<MemberRole | null> {
    const membership = await this.prisma.companyMember.findUnique({
      where: {
        companyId_userId: {
          companyId,
          userId,
        },
      },
    });

    return membership?.role || null;
  }

  async isOwner(userId: string, companyId: string): Promise<boolean> {
    const role = await this.getUserRole(userId, companyId);
    return role === MemberRole.OWNER;
  }

  async isMember(userId: string, companyId: string): Promise<boolean> {
    const role = await this.getUserRole(userId, companyId);
    return role !== null;
  }
}

