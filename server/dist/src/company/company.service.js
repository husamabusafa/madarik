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
exports.CompanyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let CompanyService = class CompanyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        return this.prisma.company.findUnique({
            where: { id },
        });
    }
    async findBySlug(slug) {
        return this.prisma.company.findUnique({
            where: { slug },
        });
    }
    async create(data) {
        const existingCompany = await this.findBySlug(data.slug);
        if (existingCompany) {
            throw new common_1.BadRequestException('Company slug already exists');
        }
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
            await tx.companyMember.create({
                data: {
                    companyId: company.id,
                    userId: data.ownerUserId,
                    role: client_1.MemberRole.OWNER,
                },
            });
            return company;
        });
    }
    async getUserCompanies(userId) {
        const memberships = await this.prisma.companyMember.findMany({
            where: { userId },
            include: { company: true },
        });
        return memberships.map(membership => membership.company);
    }
    async getUserRole(userId, companyId) {
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
    async isOwner(userId, companyId) {
        const role = await this.getUserRole(userId, companyId);
        return role === client_1.MemberRole.OWNER;
    }
    async isMember(userId, companyId) {
        const role = await this.getUserRole(userId, companyId);
        return role !== null;
    }
};
exports.CompanyService = CompanyService;
exports.CompanyService = CompanyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompanyService);
//# sourceMappingURL=company.service.js.map