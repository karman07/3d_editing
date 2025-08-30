import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RevisionDocument = Revision & Document;

@Schema({ timestamps: true })
export class Revision {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: 'Model3D', required: true })
  modelId: string;

  @Prop({ required: true })
  fileUrl: string; // new file uploaded by user

  @Prop({ enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' })
  status: string;
}

export const RevisionSchema = SchemaFactory.createForClass(Revision);
