import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Revision, RevisionDocument } from './revisions.schema';
import { ModelsService } from '../models/models.service';
import { AssignmentsService } from '../assignments/assignment.service';

@Injectable()
export class RevisionsService {
  constructor(
    @InjectModel(Revision.name) private revisionModel: Model<RevisionDocument>,
    private modelsService: ModelsService,
    private assignmentsService: AssignmentsService,
  ) {}

  // Create a new revision (pending by default)
  async submit(userId: string, modelId: string, filePath: string): Promise<Revision> {
    // Normalize path: convert Windows "\" to "/" for safe URL usage
    const normalizedPath = filePath.replace(/\\/g, '/');
    // Ensure it starts with "/" so it works in frontend URLs
    const publicPath = normalizedPath.startsWith('/')
      ? normalizedPath
      : `/${normalizedPath}`;

    const created = new this.revisionModel({
      userId,
      modelId,
      fileUrl: publicPath,
      status: 'PENDING',
      createdAt: new Date(),
    });
    return created.save();
  }

  // Approve revision
  async approve(revisionId: string): Promise<Revision | null> {
    const revision = await this.revisionModel.findById(revisionId).exec();
    if (!revision) return null;

    // Replace model file
    await this.modelsService.replaceFile(
      revision.modelId.toString(),
      revision.fileUrl,
    );

    // Remove assignment
    await this.assignmentsService.remove(
      revision.userId.toString(),
      revision.modelId.toString(),
    );

    revision.status = 'APPROVED';
    await revision.save();
    return revision;
  }

  // Reject revision
  async reject(revisionId: string): Promise<Revision | null> {
    return this.revisionModel.findByIdAndUpdate(
      revisionId,
      { status: 'REJECTED' },
      { new: true },
    );
  }

  // Find all revisions for a model
  async findByModel(modelId: string): Promise<Revision[]> {
    return this.revisionModel.find({ modelId }).exec();
  }

  // Find all revisions (admin only)
  async findAll(): Promise<Revision[]> {
    return this.revisionModel.find().exec();
  }
}
