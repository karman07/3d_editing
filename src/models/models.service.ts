import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Model3D, ModelDocument } from './models.schema';

@Injectable()
export class ModelsService {
  constructor(@InjectModel(Model3D.name) private model: Model<ModelDocument>) {}

  async create(data: Partial<Model3D>): Promise<Model3D> {
    const created = new this.model(data);
    return created.save();
  }

  async findAll(): Promise<Model3D[]> {
    return this.model.find().exec();
  }

  async findById(id: string): Promise<Model3D | null> {
    return this.model.findById(id).exec();
  }

  async replaceFile(modelId: string, newFileUrl: string): Promise<Model3D> {
    return this.model.findByIdAndUpdate(modelId, { fileUrl: newFileUrl }, { new: true }).exec();
  }
}
