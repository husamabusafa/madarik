import { UserService } from './user.service';
import { User } from './user.entity';
export declare class UserResolver {
    private userService;
    constructor(userService: UserService);
    me(user: User): Promise<User>;
    user(id: string): Promise<User | null>;
}
