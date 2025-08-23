import { PrismaService } from '../prisma/prisma.service';
import { User, Locale } from '@prisma/client';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(data: {
        email: string;
        password: string;
        preferredLocale?: Locale;
    }): Promise<User>;
    verifyEmail(userId: string): Promise<User>;
    updateLastLogin(userId: string): Promise<User>;
    validatePassword(user: User, password: string): Promise<boolean>;
}
