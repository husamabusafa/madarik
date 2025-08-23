import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Listing, ListingStatus } from '@prisma/client';

@Injectable()
export class ListingService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Listing | null> {
    return this.prisma.listing.findUnique({
      where: { id },
    });
  }

  async findPublishedListings(filters?: {
    country?: string;
    city?: string;
    propertyType?: string;
    listingType?: string;
    minPrice?: number;
    maxPrice?: number;
    minBedrooms?: number;
    minBathrooms?: number;
    limit?: number;
    offset?: number;
  }): Promise<Listing[]> {
    const where: any = {
      status: ListingStatus.PUBLISHED,
    };

    if (filters?.country) where.country = filters.country;
    if (filters?.city) where.city = filters.city;
    if (filters?.propertyType) where.propertyType = filters.propertyType;
    if (filters?.listingType) where.listingType = filters.listingType;
    if (filters?.minPrice || filters?.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }
    if (filters?.minBedrooms) where.bedrooms = { gte: filters.minBedrooms };
    if (filters?.minBathrooms) where.bathrooms = { gte: filters.minBathrooms };

    return this.prisma.listing.findMany({
      where,
      take: filters?.limit || 20,
      skip: filters?.offset || 0,
      orderBy: { publishedAt: 'desc' },
    });
  }

  async findCompanyListings(companyId: string): Promise<Listing[]> {
    return this.prisma.listing.findMany({
      where: { companyId },
      orderBy: { updatedAt: 'desc' },
    });
  }
}

