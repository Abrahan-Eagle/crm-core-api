import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false, versionKey: false })
export class CallLogDocument {
  @Prop({ required: true, type: Types.ObjectId })
  created_by: Types.ObjectId;

  @Prop({ required: true, type: Date })
  created_at: Date;
}

export const CallLogSchema = SchemaFactory.createForClass(CallLogDocument);
