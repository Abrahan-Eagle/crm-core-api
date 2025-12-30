import { Nullable } from '@internal/common';
import { updateVersionPlugin } from '@internal/mongo';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { CollectionNames } from '@/app/common';
import { CAMPAIGN_CONTACT_STATUS } from '@/domain/campaign';

@Schema({ collection: CollectionNames.CAMPAIGN_CONTACT, versionKey: 'version' })
export class CampaignContactDocument {
  _id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, index: true })
  campaign_id: Types.ObjectId;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: false, type: String })
  first_name: Nullable<string>;

  @Prop({ required: false, type: String })
  last_name: Nullable<string>;

  @Prop({ required: true, type: String, enum: CAMPAIGN_CONTACT_STATUS })
  status: CAMPAIGN_CONTACT_STATUS;

  @Prop({ required: false, type: Date })
  updated_at?: Date;

  @Prop({ required: true, type: Number, default: 0 })
  version: number;
}

export const CampaignContactSchema = SchemaFactory.createForClass(CampaignContactDocument).plugin(updateVersionPlugin);
