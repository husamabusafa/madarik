import { Locale } from '@prisma/client';
export declare class User {
    id: string;
    email: string;
    passwordHash?: string;
    emailVerifiedAt?: Date | null;
    preferredLocale: Locale;
    createdAt: Date;
    lastLoginAt?: Date | null;
}
