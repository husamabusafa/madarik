import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateLeadInput, UpdateLeadInput, LeadStats } from './dto/lead.dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const leads = await this.prisma.lead.findMany({
      include: {
        listing: {
          include: {
            translations: true,
          },
        },
        assignedTo: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return leads.map(lead => ({
      ...lead,
      listing: lead.listing ? {
        ...lead.listing,
        price: lead.listing.price?.toString() || null,
        areaValue: lead.listing.areaValue?.toString() || null,
        lat: lead.listing.lat.toString(),
        lng: lead.listing.lng.toString(),
      } : null,
    }));
  }

  async findById(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        listing: {
          include: {
            translations: true,
          },
        },
        assignedTo: true,
      },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return {
      ...lead,
      listing: lead.listing ? {
        ...lead.listing,
        price: lead.listing.price?.toString() || null,
        areaValue: lead.listing.areaValue?.toString() || null,
        lat: lead.listing.lat.toString(),
        lng: lead.listing.lng.toString(),
      } : null,
    };
  }

  async findByListingId(listingId: string) {
    const leads = await this.prisma.lead.findMany({
      where: { listingId },
      include: {
        listing: {
          include: {
            translations: true,
          },
        },
        assignedTo: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return leads.map(lead => ({
      ...lead,
      listing: lead.listing ? {
        ...lead.listing,
        price: lead.listing.price?.toString() || null,
        areaValue: lead.listing.areaValue?.toString() || null,
        lat: lead.listing.lat.toString(),
        lng: lead.listing.lng.toString(),
      } : null,
    }));
  }

  async findByAssignedUser(userId: string) {
    const leads = await this.prisma.lead.findMany({
      where: { assignedToUserId: userId },
      include: {
        listing: {
          include: {
            translations: true,
          },
        },
        assignedTo: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return leads.map(lead => ({
      ...lead,
      listing: lead.listing ? {
        ...lead.listing,
        price: lead.listing.price?.toString() || null,
        areaValue: lead.listing.areaValue?.toString() || null,
        lat: lead.listing.lat.toString(),
        lng: lead.listing.lng.toString(),
      } : null,
    }));
  }

  async create(data: CreateLeadInput) {
    // Increment lead count for listing metrics
    await this.prisma.listingMetrics.upsert({
      where: { listingId: data.listingId },
      update: {
        leadsCount: { increment: 1 },
      },
      create: {
        listingId: data.listingId,
        viewCount: 0,
        leadsCount: 1,
      },
    });

    const lead = await this.prisma.lead.create({
      data,
      include: {
        listing: {
          include: {
            translations: true,
          },
        },
        assignedTo: true,
      },
    });

    return {
      ...lead,
      listing: lead.listing ? {
        ...lead.listing,
        price: lead.listing.price?.toString() || null,
        areaValue: lead.listing.areaValue?.toString() || null,
        lat: lead.listing.lat.toString(),
        lng: lead.listing.lng.toString(),
      } : null,
    };
  }

  async update(id: string, data: UpdateLeadInput) {
    await this.findById(id);

    const lead = await this.prisma.lead.update({
      where: { id },
      data,
      include: {
        listing: {
          include: {
            translations: true,
          },
        },
        assignedTo: true,
      },
    });

    return {
      ...lead,
      listing: lead.listing ? {
        ...lead.listing,
        price: lead.listing.price?.toString() || null,
        areaValue: lead.listing.areaValue?.toString() || null,
        lat: lead.listing.lat.toString(),
        lng: lead.listing.lng.toString(),
      } : null,
    };
  }

  async assignLead(id: string, userId: string) {
    const lead = await this.findById(id);
    
    if (lead.assignedToUserId) {
      throw new Error('Lead is already assigned');
    }

    const updatedLead = await this.prisma.lead.update({
      where: { id },
      data: { assignedToUserId: userId },
      include: {
        listing: {
          include: {
            translations: true,
          },
        },
        assignedTo: true,
      },
    });

    return {
      ...updatedLead,
      listing: updatedLead.listing ? {
        ...updatedLead.listing,
        price: updatedLead.listing.price?.toString() || null,
        areaValue: updatedLead.listing.areaValue?.toString() || null,
        lat: updatedLead.listing.lat.toString(),
        lng: updatedLead.listing.lng.toString(),
      } : null,
    };
  }

  async unassignLead(id: string) {
    await this.findById(id);

    const updatedLead = await this.prisma.lead.update({
      where: { id },
      data: { assignedToUserId: null },
      include: {
        assignedTo: true,
        listing: {
          include: {
            translations: true,
          },
        },
      },
    });

    return {
      ...updatedLead,
      listing: updatedLead.listing ? {
        ...updatedLead.listing,
        price: updatedLead.listing.price?.toString() || null,
        areaValue: updatedLead.listing.areaValue?.toString() || null,
        lat: updatedLead.listing.lat.toString(),
        lng: updatedLead.listing.lng.toString(),
      } : null,
    };
  }

  async delete(id: string) {
    const lead = await this.findById(id);
    
    // Decrement lead count for listing metrics
    await this.prisma.listingMetrics.update({
      where: { listingId: lead.listingId },
      data: {
        leadsCount: { decrement: 1 },
      },
    });

    return this.prisma.lead.delete({
      where: { id },
    });
  }

  async getLeadStats(): Promise<LeadStats> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [
      totalLeads,
      assignedLeads,
      unassignedLeads,
      thisWeekLeads,
      totalListings,
    ] = await Promise.all([
      this.prisma.lead.count(),
      this.prisma.lead.count({ where: { assignedToUserId: { not: null } } }),
      this.prisma.lead.count({ where: { assignedToUserId: null } }),
      this.prisma.lead.count({ where: { createdAt: { gte: oneWeekAgo } } }),
      this.prisma.listing.count({ where: { status: 'PUBLISHED' } }),
    ]);

    const newLeads = thisWeekLeads;
    const conversionRate = totalListings > 0 ? (totalLeads / totalListings) * 100 : 0;

    return {
      totalLeads,
      newLeads,
      assignedLeads,
      unassignedLeads,
      thisWeekLeads,
      conversionRate: Math.round(conversionRate * 100) / 100,
    };
  }

  async searchLeads(query: string) {
    const leads = await this.prisma.lead.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query, mode: 'insensitive' } },
          { message: { contains: query, mode: 'insensitive' } },
          {
            listing: {
              translations: {
                some: {
                  title: { contains: query, mode: 'insensitive' },
                },
              },
            },
          },
        ],
      },
      include: {
        assignedTo: true,
        listing: {
          include: {
            translations: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return leads.map(lead => ({
      ...lead,
      listing: lead.listing ? {
        ...lead.listing,
        price: lead.listing.price?.toString() || null,
        areaValue: lead.listing.areaValue?.toString() || null,
        lat: lead.listing.lat.toString(),
        lng: lead.listing.lng.toString(),
      } : null,
    }));
  }
}
