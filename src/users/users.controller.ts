import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from './roles.enum';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Get logged-in user
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req) {
    return req.user;
  }

  // Get all users (Admin only)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get()
  async getAll() {
    return this.usersService.findAll();
  }

  // Get user by ID (Admin only)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  // Create user (Admin only)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  async create(@Body() body: { username: string; password: string; role: Role }) {
    return this.usersService.create(body.username, body.password, body.role);
  }

  // Update user (Admin only)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { username?: string; password?: string; role?: Role },
  ) {
    return this.usersService.update(id, body);
  }

  // Delete user (Admin only)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
