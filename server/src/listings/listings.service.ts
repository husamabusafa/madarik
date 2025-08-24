import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateListingInput, UpdateListingInput } from './dto/listing.dto';
import { ListingStatus } from '../common/enums';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const listings = await this.prisma.listing.findMany({
      include: {
        translations: true,
        createdBy: true,
        lastEditedBy: true,
        media: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
        leads: true,
        metrics: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return listings.map(listing => ({
      ...listing,
      price: listing.price?.toString() || null,
      areaValue: listing.areaValue?.toString() || null,
      lat: listing.lat.toString(),
      lng: listing.lng.toString(),
    }));
  }

  async findById(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        translations: true,
        createdBy: true,
        lastEditedBy: true,
        media: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
        leads: true,
        metrics: true,
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    return {
      ...listing,
      price: listing.price?.toString() || null,
      areaValue: listing.areaValue?.toString() || null,
      lat: listing.lat.toString(),
      lng: listing.lng.toString(),
    };
  }

  async create(data: CreateListingInput, userId: string) {
    const { translations, ...listingData } = data;

    const listing = await this.prisma.listing.create({
      data: {
        ...listingData,
        createdByUserId: userId,
        lastEditedByUserId: userId,
        translations: {
          create: translations.map(t => ({
            ...t,
            locale: t.locale as any, // Cast to Prisma enum
          })),
        },
        metrics: {
          create: {
            viewCount: 0,
            leadsCount: 0,
          },
        },
      },
      include: {
        translations: true,
        createdBy: true,
        lastEditedBy: true,
        media: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
        leads: true,
        metrics: true,
      },
    });

    return {
      ...listing,
      price: listing.price?.toString() || null,
      areaValue: listing.areaValue?.toString() || null,
      lat: listing.lat.toString(),
      lng: listing.lng.toString(),
    };
  }

  async update(id: string, data: UpdateListingInput, userId: string) {
    await this.findById(id);

    const listing = await this.prisma.listing.update({
      where: { id },
      data: {
        ...data,
        lastEditedByUserId: userId,
      },
      include: {
        translations: true,
        createdBy: true,
        lastEditedBy: true,
        media: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
        leads: true,
        metrics: true,
      },
    });

    return {
      ...listing,
      price: listing.price?.toString() || null,
      areaValue: listing.areaValue?.toString() || null,
      lat: listing.lat.toString(),
      lng: listing.lng.toString(),
    };
  }

  async updateStatus(id: string, status: ListingStatus, userId: string, reason?: string) {
    const listing = await this.findById(id);

    // Log status change
    await this.prisma.listingStatusLog.create({
      data: {
        listingId: id,
        fromStatus: listing.status,
        toStatus: status,
        actorUserId: userId,
        reason,
      },
    });

    // Update published date if publishing
    const updateData: any = {
      status,
      lastEditedByUserId: userId,
    };

    if (status === ListingStatus.PUBLISHED && listing.status !== ListingStatus.PUBLISHED) {
      updateData.publishedAt = new Date();
    }

    const updatedListing = await this.prisma.listing.update({
      where: { id },
      data: updateData,
      include: {
        translations: true,
        createdBy: true,
        lastEditedBy: true,
        media: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
        leads: true,
        metrics: true,
      },
    });

    return {
      ...updatedListing,
      price: updatedListing.price?.toString() || null,
      areaValue: updatedListing.areaValue?.toString() || null,
      lat: updatedListing.lat.toString(),
      lng: updatedListing.lng.toString(),
    };
  }

  async delete(id: string) {
    await this.findById(id);
    
    return this.prisma.listing.delete({
      where: { id },
    });
  }

  async incrementViewCount(id: string) {
    await this.prisma.listingMetrics.upsert({
      where: { listingId: id },
      update: {
        viewCount: { increment: 1 },
        lastViewedAt: new Date(),
      },
      create: {
        listingId: id,
        viewCount: 1,
        leadsCount: 0,
        lastViewedAt: new Date(),
      },
    });
  }

  async getPublishedListings() {
    const listings = await this.prisma.listing.findMany({
      where: { status: ListingStatus.PUBLISHED },
      include: {
        translations: true,
        media: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
        metrics: true,
      },
      orderBy: { publishedAt: 'desc' },
    });

    return listings.map(listing => ({
      ...listing,
      price: listing.price?.toString() || null,
      areaValue: listing.areaValue?.toString() || null,
      lat: listing.lat.toString(),
      lng: listing.lng.toString(),
    }));
  }

  async searchListings(query: string, filters?: any) {
    const where: any = {
      status: ListingStatus.PUBLISHED,
    };

    if (query) {
      where.OR = [
        {
          translations: {
            some: {
              title: { contains: query, mode: 'insensitive' },
            },
          },
        },
        {
          translations: {
            some: {
              description: { contains: query, mode: 'insensitive' },
            },
          },
        },
        {
          city: { contains: query, mode: 'insensitive' },
        },
        {
          addressLine: { contains: query, mode: 'insensitive' },
        },
      ];
    }

    if (filters?.propertyType) {
      where.propertyType = filters.propertyType;
    }

    if (filters?.listingType) {
      where.listingType = filters.listingType;
    }

    if (filters?.minPrice || filters?.maxPrice) {
      where.price = {};
      if (filters.minPrice) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice) {
        where.price.lte = filters.maxPrice;
      }
    }

    if (filters?.bedrooms) {
      where.bedrooms = { gte: filters.bedrooms };
    }

    if (filters?.bathrooms) {
      where.bathrooms = { gte: filters.bathrooms };
    }

    const listings = await this.prisma.listing.findMany({
      where,
      include: {
        translations: true,
        media: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
        metrics: true,
      },
      orderBy: { publishedAt: 'desc' },
    });

    return listings.map(listing => ({
      ...listing,
      price: listing.price?.toString() || null,
      areaValue: listing.areaValue?.toString() || null,
      lat: listing.lat.toString(),
      lng: listing.lng.toString(),
    }));
  }
}
