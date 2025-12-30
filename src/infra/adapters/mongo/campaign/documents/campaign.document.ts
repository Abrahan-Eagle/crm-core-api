import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { CollectionNames } from '@/app/common';

@Schema({ collection: CollectionNames.CAMPAIGN, versionKey: false })
export class CampaignDocument {
  _id: Types.ObjectId;

  @Prop({ required: true, type: String })
  sender: string;

  @Prop({ required: true, type: String })
  message: string;

  @Prop({ required: true, type: String })
  subject: string;

  @Prop({ required: true, type: Number, min: 1 })
  contacts: number;

  @Prop({ required: false, type: String, default: null })
  job_id: string | null;
}

export const CampaignSchema = SchemaFactory.createForClass(CampaignDocument);
