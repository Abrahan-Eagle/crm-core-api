import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { CollectionNames } from '@/app/common';
import { COMPLAINT_TYPE } from '@/domain/campaign';

@Schema({ collection: CollectionNames.COMPLAINT, versionKey: false })
export class ComplaintDocument {
  _id: Types.ObjectId;

  @Prop({ required: true, type: String, enum: COMPLAINT_TYPE })
  type: COMPLAINT_TYPE;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: false, type: Date })
  created_at: Date;
}

export const ComplaintSchema = SchemaFactory.createForClass(ComplaintDocument);
