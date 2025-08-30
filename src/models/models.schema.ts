import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ModelDocument = Model3D & Document;

@Schema({ timestamps: true })
export class Model3D {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  fileUrl: string; 
}

export const ModelSchema = SchemaFactory.createForClass(Model3D);
