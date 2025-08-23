import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User, Locale } from '@prisma/client';
export interface JwtPayload {
    sub: string;
    email: string;
}
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    register(email: string, password: string, preferredLocale?: Locale): Promise<{
        user: User;
        token: string;
    }>;
    login(email: string, password: string): Promise<{
        user: User;
        token: string;
    }>;
    validateUser(payload: JwtPayload): Promise<User | null>;
    private generateToken;
}
