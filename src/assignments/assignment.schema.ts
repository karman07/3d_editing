import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AssignmentDocument = Assignment & Document;

@Schema({ timestamps: true })
export class Assignment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: 'Model3D', required: true })
  modelId: string;

  @Prop({ default: true })
  canEdit: boolean;
}

export const AssignmentSchema = SchemaFactory.createForClass(Assignment);
