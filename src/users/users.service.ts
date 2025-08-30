import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Create new user with hashed password
  async create(username: string, password: string, role: string): Promise<UserDocument> {
    const hash = await bcrypt.hash(password, 10);
    const user = new this.userModel({ username, password: hash, role });
    return user.save();
  }

  // Find by username (used for login)
  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  // Find all users (without password)
  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().select('-password').exec();
  }

  // Find by ID (without password)
  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).select('-password').exec();
  }

  // Update user (rehash password if provided)
  async update(
    id: string,
    updateData: { username?: string; password?: string; role?: string },
  ): Promise<UserDocument | null> {
    const updateFields: any = {};
    if (updateData.username) updateFields.username = updateData.username;
    if (updateData.role) updateFields.role = updateData.role;
    if (updateData.password) {
      updateFields.password = await bcrypt.hash(updateData.password, 10);
    }

    return this.userModel
      .findByIdAndUpdate(id, updateFields, { new: true })
      .select('-password')
      .exec();
  }

  // Delete user
  async remove(id: string): Promise<any> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
