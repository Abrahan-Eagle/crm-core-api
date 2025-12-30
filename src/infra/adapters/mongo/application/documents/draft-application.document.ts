import { Nullable } from '@internal/common';
import { updateVersionPlugin } from '@internal/mongo';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { CollectionNames } from '@/app/common';
import { PRODUCT_TYPE } from '@/domain/common';

import { ApplicationReferralDocument, ApplicationReferralSchema } from './application-referrals.document';
import { DraftApplicationFileDocument, DraftApplicationFileSchema } from './draft-application-file.document';

@Schema({ collection: CollectionNames.DRAFT_APPLICATION, versionKey: 'version' })
export class DraftApplicationDocument {
  _id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  company_id: Types.ObjectId;

  @Prop({ required: true, type: String })
  period: string;

  @Prop({ required: true, type: Number })
  loan_amount: number;

  @Prop({ required: true, type: Number })
  prospect_id: number;

  @Prop({ required: true, type: String, enum: PRODUCT_TYPE })
  product: PRODUCT_TYPE;

  @Prop({ required: false, type: ApplicationReferralSchema, default: null })
  referral: Nullable<ApplicationReferralDocument>;

  @Prop({ required: true, type: [DraftApplicationFileSchema] })
  bank_statements: DraftApplicationFileDocument[];

  @Prop({ required: false, type: String, default: null })
  signature_url: string | null;

  @Prop({ required: false, type: Types.ObjectId, default: null })
  created_by: Nullable<Types.ObjectId>;

  @Prop({ required: true, type: Date })
  created_at: Date;

  @Prop({ required: false, type: Date })
  updated_at?: Date;

  @Prop({ required: true, type: Number, default: 0 })
  version?: number;
}

export const DraftApplicationSchema = SchemaFactory.createForClass(DraftApplicationDocument)
  .index(
    {
      period: 1,
      company_id: 1,
    },
    { unique: true },
  )
  .plugin(updateVersionPlugin);
