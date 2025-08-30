import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Assignment, AssignmentSchema } from './assignment.schema';
import { AssignmentsService } from './assignment.service';
import { AssignmentsController } from './assignment.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Assignment.name, schema: AssignmentSchema }])],
  providers: [AssignmentsService],
  controllers: [AssignmentsController],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
