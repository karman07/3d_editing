import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AssignmentsService } from './assignment.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/roles.enum';

@Controller('assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @Roles(Role.Admin)
  async create(@Body() body: { userId: string; modelId: string }) {
    return this.assignmentsService.create(body.userId, body.modelId);
  }

  @Delete()
  @Roles(Role.Admin)
  async remove(@Body() body: { userId: string; modelId: string }) {
    return this.assignmentsService.remove(body.userId, body.modelId);
  }

  @Get('me')
  async findMyAssignments(@Request() req) {
    return this.assignmentsService.findByUser(req.user.userId);
  }

    @Get()
  @Roles(Role.Admin)
  async findAll() {
    return this.assignmentsService.findAll();
  }
}
