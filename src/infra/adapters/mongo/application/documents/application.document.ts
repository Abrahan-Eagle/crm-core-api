import { Nullable } from '@internal/common';
import { updateVersionPlugin } from '@internal/mongo';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { CollectionNames } from '@/app/common';
import { APPLICATION_STATUS, APPLICATION_SUBSTATUS, REJECT_REASONS } from '@/domain/application';
import { PRODUCT_TYPE } from '@/domain/common';

import { ApplicationFileDocument, ApplicationFileSchema } from './application-file.document';
import { ApplicationReferralDocument, ApplicationReferralSchema } from './application-referrals.document';
import { BankNotificationDocument, BankNotificationSchema } from './bank-notification.document';
import { FilledApplicationFileDocument, FilledApplicationFileSchema } from './filled-application-file.document';

@Schema({ collection: CollectionNames.APPLICATION, versionKey: 'version' })
export class ApplicationDocument {
  _id: Types.ObjectId;

  @Prop({ required: true, type: String, enum: APPLICATION_STATUS })
  status: APPLICATION_STATUS;

  @Prop({ required: false, type: String, default: null })
  substatus: APPLICATION_SUBSTATUS | null;

  @Prop({ required: true, type: Types.ObjectId })
  company_id: Types.ObjectId;

  @Prop({ required: true, type: String })
  track_id: string;

  @Prop({ required: true, type: String })
  period: string;

  @Prop({ required: true, type: Number })
  loan_amount: number;

  @Prop({ required: true, type: String, enum: PRODUCT_TYPE })
  product: PRODUCT_TYPE;

  @Prop({ required: false, type: ApplicationReferralSchema, default: null })
  referral: Nullable<ApplicationReferralDocument>;

  @Prop({ required: true, type: [FilledApplicationFileSchema] })
  filled_applications: FilledApplicationFileDocument[];

  @Prop({ required: true, type: [ApplicationFileSchema] })
  bank_statements: ApplicationFileDocument[];

  @Prop({ required: false, type: [ApplicationFileSchema], default: [] })
  mtd_statements: ApplicationFileDocument[];

  @Prop({ required: false, type: [ApplicationFileSchema], default: [] })
  credit_card_statements: ApplicationFileDocument[];

  @Prop({ required: false, type: [ApplicationFileSchema], default: [] })
  additional_statements: ApplicationFileDocument[];

  @Prop({ required: false, type: [BankNotificationSchema], default: [] })
  notifications: BankNotificationDocument[];

  @Prop({ required: false, type: String, default: null })
  reject_reason: Nullable<REJECT_REASONS>;

  @Prop({ required: false, type: String, default: null })
  reject_reason_description: Nullable<string>;

  @Prop({ required: true, type: String })
  tenant_id: string;

  @Prop({ required: false, type: String, default: null })
  signature_url: string | null;

  @Prop({ required: false, type: Types.ObjectId, default: null })
  created_by: Nullable<Types.ObjectId>;

  @Prop({ required: true, type: Date })
  created_at: Date;

  @Prop({ required: false, type: Date })
  updated_at?: Date;

  @Prop({ required: false, type: Number, default: null })
  position: Nullable<number>;

  @Prop({ required: true, type: Number, default: 0 })
  version?: number;
}

export const ApplicationSchema = SchemaFactory.createForClass(ApplicationDocument)
  .index(
    {
      track_id: 1,
      tenant_id: 1,
    },
    { unique: true },
  )
  .plugin(updateVersionPlugin);
