import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { UserRole } from '@prisma/client';
import {
  UpdateUserRoleDto,
  UpdateUserStatusDto,
  UpdateProfileDto,
  SearchUsersDto,
  UserResponseDto,
  UserStatsDto,
  UserForAssignmentDto,
} from './dto/users.dto';
import { CurrentUser as ICurrentUser } from '../common/interfaces/user.interface';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async getAllUsers(@Query() paginationDto: PaginationDto) {
    const result = await this.usersService.getAllUsers(
      paginationDto.page,
      paginationDto.limit,
    );
    
    return {
      success: true,
      data: result.users,
      pagination: result.pagination,
      message: 'Users retrieved',
    };
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('search')
  async searchUsers(
    @Query() searchDto: SearchUsersDto & PaginationDto,
  ) {
    const result = await this.usersService.searchUsers(
      searchDto.q,
      searchDto.page,
      searchDto.limit,
    );
    
    return {
      success: true,
      data: result.users,
      pagination: result.pagination,
      message: 'Users found',
    };
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('stats')
  async getUserStats(): Promise<{ success: boolean; data: UserStatsDto; message: string }> {
    const stats = await this.usersService.getUserStats();
    
    return {
      success: true,
      data: stats,
      message: 'User statistics retrieved',
    };
  }

  @Get('for-assignment')
  async getUsersForAssignment(): Promise<{ success: boolean; data: UserForAssignmentDto[]; message: string }> {
    const users = await this.usersService.getUsersForAssignment();
    
    return {
      success: true,
      data: users,
      message: 'Users for assignment retrieved',
    };
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<{ success: boolean; data: UserResponseDto; message: string }> {
    const user = await this.usersService.getUserById(id);
    
    return {
      success: true,
      data: user,
      message: 'User retrieved',
    };
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id/role')
  @HttpCode(HttpStatus.OK)
  async updateUserRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateUserRoleDto,
  ): Promise<{ success: boolean; data: UserResponseDto; message: string }> {
    const user = await this.usersService.updateUserRole(id, updateRoleDto.role);
    
    return {
      success: true,
      data: user,
      message: 'User role updated',
    };
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id/status')
  @HttpCode(HttpStatus.OK)
  async updateUserStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateUserStatusDto,
  ): Promise<{ success: boolean; data: UserResponseDto; message: string }> {
    const user = await this.usersService.toggleUserStatus(id, updateStatusDto.isActive);
    
    const message = updateStatusDto.isActive ? 'User activated' : 'User deactivated';
    return {
      success: true,
      data: user,
      message,
    };
  }

  @Put('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @CurrentUser() currentUser: ICurrentUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<{ success: boolean; data: UserResponseDto; message: string }> {
    const user = await this.usersService.updateProfile(currentUser.id, updateProfileDto);
    
    return {
      success: true,
      data: user,
      message: 'Profile updated',
    };
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id/profile')
  @HttpCode(HttpStatus.OK)
  async updateUserProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<{ success: boolean; data: UserResponseDto; message: string }> {
    const user = await this.usersService.updateProfile(id, updateProfileDto);
    
    return {
      success: true,
      data: user,
      message: 'User profile updated',
    };
  }
}
