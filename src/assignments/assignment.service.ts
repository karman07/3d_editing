import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assignment, AssignmentDocument } from './assignment.schema';

@Injectable()
export class AssignmentsService {
  constructor(@InjectModel(Assignment.name) private assignmentModel: Model<AssignmentDocument>) {}

  async create(userId: string, modelId: string): Promise<Assignment> {
    const created = new this.assignmentModel({ userId, modelId });
    return created.save();
  }

  async remove(userId: string, modelId: string): Promise<any> {
    return this.assignmentModel.findOneAndDelete({ userId, modelId }).exec();
  }

  async findByUser(userId: string): Promise<Assignment[]> {
    return this.assignmentModel.find({ userId }).populate('modelId').exec();
  }

  
  async findAll(): Promise<Assignment[]> {
    return this.assignmentModel.find().populate('modelId userId').exec();
  }
}
