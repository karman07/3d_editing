import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Revision, RevisionSchema } from './revisions.schema';
import { RevisionsService } from './revisions.service';
import { RevisionsController } from './revisions.controller';
import { ModelsModule } from '../models/models.module';
import { AssignmentsModule } from '../assignments/assignments.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Revision.name, schema: RevisionSchema }]),
    ModelsModule,
    AssignmentsModule,
  ],
  providers: [RevisionsService],
  controllers: [RevisionsController],
})
export class RevisionsModule {}
