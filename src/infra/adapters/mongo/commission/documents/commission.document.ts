import { updateVersionPlugin } from '@internal/mongo';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { CollectionNames } from '@/app/common';
import { COMMISSION_STATUS } from '@/domain/commission';

import { CommissionDetailDocument, CommissionDetailSchema } from './commission-detail.document';

@Schema({ collection: CollectionNames.COMMISSION, versionKey: 'version' })
export class CommissionDocument {
  _id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  application_id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  company_id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  tenant_id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  bank_id: Types.ObjectId;

  @Prop({ required: true, type: CommissionDetailSchema })
  commission: CommissionDetailDocument;

  @Prop({ required: true, type: CommissionDetailSchema })
  psf: CommissionDetailDocument;

  @Prop({ required: true, type: String, enum: COMMISSION_STATUS })
  status: COMMISSION_STATUS;

  @Prop({ required: true, type: Date })
  created_at: Date;

  @Prop({ required: false, type: Date })
  updated_at?: Date;

  @Prop({ required: true, type: Number, default: 0 })
  version?: number;
}

export const CommissionSchema = SchemaFactory.createForClass(CommissionDocument).plugin(updateVersionPlugin);
