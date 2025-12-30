import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { CollectionNames } from '@/app/common';

@Schema({ collection: CollectionNames.LEAD, versionKey: false })
export class LeadGroupDocument {
  _id: Types.ObjectId;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: Number })
  prospect_count: number;

  @Prop({ required: true, type: Types.ObjectId, index: true })
  assigned_to: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  created_by: Types.ObjectId;

  @Prop({ required: true, type: Date })
  created_at: Date;
}

export const LeadGroupSchema = SchemaFactory.createForClass(LeadGroupDocument);
