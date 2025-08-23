import { PrismaService } from '../prisma/prisma.service';
import { Company, MemberRole } from '@prisma/client';
export declare class CompanyService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<Company | null>;
    findBySlug(slug: string): Promise<Company | null>;
    create(data: {
        name: string;
        slug: string;
        country: string;
        city: string;
        ownerUserId: string;
        logoUrl?: string;
        publicEmail?: string;
        publicPhone?: string;
        website?: string;
    }): Promise<Company>;
    getUserCompanies(userId: string): Promise<Company[]>;
    getUserRole(userId: string, companyId: string): Promise<MemberRole | null>;
    isOwner(userId: string, companyId: string): Promise<boolean>;
    isMember(userId: string, companyId: string): Promise<boolean>;
}
