import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Request,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RevisionsService } from './revisions.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/roles.enum';

@Controller('revisions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RevisionsController {
  constructor(private readonly revisionsService: RevisionsService) {}

  // User submits a revision with form-data (file + modelId)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/revisions',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, file.fieldname + '-' + uniqueSuffix + ext);
        },
      }),
    }),
  )
  async submit(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { modelId: string },
  ) {
    return this.revisionsService.submit(req.user.userId, body.modelId, file.path);
  }

  // Admin approves revision
  @Post('approve/:id')
  @Roles(Role.Admin)
  async approve(@Param('id') revisionId: string) {
    return this.revisionsService.approve(revisionId);
  }

  // Admin rejects revision
  @Post('reject/:id')
  @Roles(Role.Admin)
  async reject(@Param('id') revisionId: string) {
    return this.revisionsService.reject(revisionId);
  }

  // Get all revisions for a model
  @Get('model/:id')
  async getByModel(@Param('id') modelId: string) {
    return this.revisionsService.findByModel(modelId);
  }

  // Get all revisions (admin only)
  @Get()
  @Roles(Role.Admin)
  async getAll() {
    return this.revisionsService.findAll();
  }
}
