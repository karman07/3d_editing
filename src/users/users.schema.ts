import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from './roles.enum';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: Role, default: Role.User })
  role: Role;
}

// Create a Mongoose Document type
export type UserDocument = User & Document;

// Generate schema
export const UserSchema = SchemaFactory.createForClass(User);
