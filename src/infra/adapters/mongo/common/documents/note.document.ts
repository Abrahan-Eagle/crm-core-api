import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { NOTE_LEVEL } from '@/domain/common';

@Schema({ versionKey: false })
export class NoteDocument {
  _id: Types.ObjectId;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, type: Types.ObjectId })
  author: Types.ObjectId;

  @Prop({ required: true, type: Date })
  created_at: Date;

  @Prop({ required: true, type: String, enum: NOTE_LEVEL })
  level: NOTE_LEVEL;
}

export const NoteSchema = SchemaFactory.createForClass(NoteDocument);
