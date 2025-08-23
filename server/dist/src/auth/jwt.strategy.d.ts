import { ConfigService } from '@nestjs/config';
import { AuthService, JwtPayload } from './auth.service';
import { User } from '@prisma/client';
declare const JwtStrategy_base: any;
export declare class JwtStrategy extends JwtStrategy_base {
    private authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
    validate(payload: JwtPayload): Promise<User>;
}
export {};
