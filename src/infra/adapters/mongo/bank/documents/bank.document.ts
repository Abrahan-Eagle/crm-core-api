import { updateVersionPlugin } from '@internal/mongo';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { CollectionNames } from '@/app/common';
import { BANK_STATUS, BANK_TYPE } from '@/domain/bank';

import { AddressDocument, AddressSchema } from '../../common';
import { BankBlacklistDocument, BankBlacklistSchema } from './bank-blacklist.document';
import { BankConstraintsDocument, BankConstraintsSchema } from './bank-constraints.document';
import { BankContactDocument, BankContactSchema } from './bank-contact-information.document';
import { BankFileDocument, BankFileSchema } from './bank-file.document';

@Schema({ collection: CollectionNames.BANK, versionKey: 'version' })
export class BankDocument {
  _id: Types.ObjectId;

  @Prop({ required: true, type: String })
  bank_name: string;

  @Prop({ required: true, type: String })
  manager: string;

  @Prop({ required: true, type: String, enum: BANK_STATUS })
  status: BANK_STATUS;

  @Prop({ required: true, type: String, enum: BANK_TYPE })
  bank_type: BANK_TYPE;

  @Prop({ required: true, type: AddressSchema })
  address: AddressDocument;

  @Prop({ required: true, type: [BankContactSchema], default: [] })
  contacts: BankContactDocument[];

  @Prop({ required: true, type: BankConstraintsSchema })
  constraints: BankConstraintsDocument;

  @Prop({ required: false, type: [BankFileSchema], default: [] })
  documents: BankFileDocument[];

  @Prop({ required: false, type: BankBlacklistSchema, default: null })
  blacklist: BankBlacklistDocument | null;

  @Prop({ required: true, type: String })
  tenant_id: string;

  @Prop({ required: true, type: Date })
  created_at: Date;

  @Prop({ required: false, type: Date })
  updated_at?: Date;

  @Prop({ required: true, type: Number, default: 0 })
  version: number;
}

export const BankSchema = SchemaFactory.createForClass(BankDocument).plugin(updateVersionPlugin);
