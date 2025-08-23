import { Locale } from '@prisma/client';
export declare class RegisterInput {
    email: string;
    password: string;
    preferredLocale?: Locale;
}
export declare class LoginInput {
    email: string;
    password: string;
}
