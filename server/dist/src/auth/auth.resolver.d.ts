import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth.response';
import { RegisterInput, LoginInput } from './dto/auth.input';
export declare class AuthResolver {
    private authService;
    constructor(authService: AuthService);
    register(input: RegisterInput): Promise<AuthResponse>;
    login(input: LoginInput): Promise<AuthResponse>;
}
