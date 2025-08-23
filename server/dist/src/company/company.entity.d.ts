import { MemberRole } from '@prisma/client';
export declare class Company {
    id: string;
    ownerUserId: string;
    name: string;
    slug: string;
    logoUrl?: string;
    country: string;
    city: string;
    publicEmail?: string;
    publicPhone?: string;
    website?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class CompanyMember {
    companyId: string;
    userId: string;
    role: MemberRole;
    addedAt: Date;
}
