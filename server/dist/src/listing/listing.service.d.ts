import { PrismaService } from '../prisma/prisma.service';
import { Listing } from '@prisma/client';
export declare class ListingService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<Listing | null>;
    findPublishedListings(filters?: {
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
    }): Promise<Listing[]>;
    findCompanyListings(companyId: string): Promise<Listing[]>;
}
