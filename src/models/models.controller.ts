import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ModelsService } from './models.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('models')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Post('upload')
  @Roles(Role.Admin)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/models', // store in local "uploads/models"
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(glb|gltf|obj|fbx)$/)) {
          return cb(new Error('Only 3D model files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadModel(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { name: string; description?: string },
  ) {
    const fileUrl = `/uploads/models/${file.filename}`;
    return this.modelsService.create({
      name: body.name,
      description: body.description,
      fileUrl,
    });
  }

  @Get()
  async findAll() {
    return this.modelsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.modelsService.findById(id);
  }
}
