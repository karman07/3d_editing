import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Model3D, ModelSchema } from './models.schema';
import { ModelsService } from './models.service';
import { ModelsController } from './models.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Model3D.name, schema: ModelSchema }])],
  providers: [ModelsService],
  controllers: [ModelsController],
  exports: [ModelsService],
})
export class ModelsModule {}
