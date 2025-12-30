import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { OFFER_PAYMENT_PLAN, OFFER_STATUS } from '@/domain/application';

@Schema({ versionKey: false })
export class OfferDocument {
  _id: Types.ObjectId;

  @Prop({ required: true, type: Number })
  purchased_amount: number;

  @Prop({ required: false, type: Number, default: null })
  factor_rate: number | null;

  @Prop({ required: false, type: Number, default: null })
  position: number | null;

  @Prop({ required: false, type: Number, default: null })
  points: number | null;

  @Prop({ required: false, type: String, enum: OFFER_PAYMENT_PLAN, default: null })
  payment_plan: OFFER_PAYMENT_PLAN | null;

  @Prop({ required: false, type: Number, default: null })
  payment_plan_duration: number | null;

  @Prop({ required: true, type: String, enum: OFFER_STATUS })
  status: OFFER_STATUS;

  @Prop({ required: false, type: Number })
  purchased_price: number;

  @Prop({ required: false, type: Number })
  commission: number;

  @Prop({ required: true, type: Date })
  created_at: Date;

  @Prop({ required: false, type: Date })
  updated_at?: Date;
}

export const OfferSchema = SchemaFactory.createForClass(OfferDocument);
