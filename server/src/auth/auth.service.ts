import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginInput, AuthPayload } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginInput: LoginInput): Promise<AuthPayload> {
    const user = await this.usersService.findByEmail(loginInput.email);
    
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials or account inactive');
    }

    const isPasswordValid = await this.usersService.validatePassword(user, loginInput.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user,
    };
  }

  async validateUser(userId: string) {
    return this.usersService.findById(userId);
  }
}
