import { Nullable } from '@internal/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { NOTIFICATION_STATUS, REJECT_REASONS } from '@/domain/application';

import { OfferDocument, OfferSchema } from './offer.document';

@Schema({ versionKey: false })
export class BankNotificationDocument {
  _id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  bank_id: Types.ObjectId;

  @Prop({ required: true, type: String, enum: NOTIFICATION_STATUS })
  status: NOTIFICATION_STATUS;

  @Prop({ type: [OfferSchema], default: [] })
  offers: OfferDocument[];

  @Prop({ required: true, type: Date })
  created_at: Date;

  @Prop({ required: false, type: Date })
  updated_at?: Date;

  @Prop({ required: false, type: String, default: null })
  reject_reason: Nullable<REJECT_REASONS>;

  @Prop({ required: false, type: String, default: null })
  reject_reason_description: Nullable<string>;
}

export const BankNotificationSchema = SchemaFactory.createForClass(BankNotificationDocument);
