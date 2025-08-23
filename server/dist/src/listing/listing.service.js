"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ListingService = class ListingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        return this.prisma.listing.findUnique({
            where: { id },
        });
    }
    async findPublishedListings(filters) {
        const where = {
            status: client_1.ListingStatus.PUBLISHED,
        };
        if (filters?.country)
            where.country = filters.country;
        if (filters?.city)
            where.city = filters.city;
        if (filters?.propertyType)
            where.propertyType = filters.propertyType;
        if (filters?.listingType)
            where.listingType = filters.listingType;
        if (filters?.minPrice || filters?.maxPrice) {
            where.price = {};
            if (filters.minPrice)
                where.price.gte = filters.minPrice;
            if (filters.maxPrice)
                where.price.lte = filters.maxPrice;
        }
        if (filters?.minBedrooms)
            where.bedrooms = { gte: filters.minBedrooms };
        if (filters?.minBathrooms)
            where.bathrooms = { gte: filters.minBathrooms };
        return this.prisma.listing.findMany({
            where,
            take: filters?.limit || 20,
            skip: filters?.offset || 0,
            orderBy: { publishedAt: 'desc' },
        });
    }
    async findCompanyListings(companyId) {
        return this.prisma.listing.findMany({
            where: { companyId },
            orderBy: { updatedAt: 'desc' },
        });
    }
};
exports.ListingService = ListingService;
exports.ListingService = ListingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ListingService);
//# sourceMappingURL=listing.service.js.map