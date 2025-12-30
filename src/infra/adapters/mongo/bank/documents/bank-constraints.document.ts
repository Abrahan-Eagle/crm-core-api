import { Nullable } from '@internal/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { BANK_CLASSIFICATION, BANK_SUPPORTED_ID } from '@/domain/bank/entities';
import { PRODUCT_TYPE } from '@/domain/common';

import { IndustryDocument, IndustrySchema } from '../../common';
import { BankConstraintsDepositDocument, BankConstraintsDepositSchema } from './bank-constraints-deposits.document';
import { BankTerritoryDocument, BankTerritorySchema } from './bank-territory.document';

@Schema({ _id: false, versionKey: false })
export class BankConstraintsDocument {
  @Prop({ required: true, type: [String], enum: BANK_CLASSIFICATION })
  classifications: BANK_CLASSIFICATION[];

  @Prop({ required: true, type: [BankTerritorySchema], default: [] })
  territories: BankTerritoryDocument[];

  @Prop({ required: false, type: BankConstraintsDepositSchema, default: null })
  deposits: BankConstraintsDepositDocument | null;

  @Prop({ required: false, type: Number, default: null })
  loan_limit: Nullable<number>;

  @Prop({ required: true, type: Boolean })
  has_loan_limit: boolean;

  @Prop({ required: true, type: Number })
  minimum_loan: number;

  @Prop({ required: true, type: Number })
  minimum_months_in_business: number;

  @Prop({ required: true, type: Number })
  minimum_daily_balance: number;

  @Prop({ required: true, type: Number })
  maximum_negative_days: number;

  @Prop({ required: true, type: [IndustrySchema], _id: false })
  allowed_industries: IndustryDocument[];

  @Prop({ required: true, type: [String], enum: BANK_SUPPORTED_ID, default: [] })
  supported_ids: BANK_SUPPORTED_ID[];

  @Prop({ required: false, type: [Number], default: [] })
  positions: number[];

  @Prop({ required: false, type: [String], enum: PRODUCT_TYPE, default: [] })
  blocked_products: PRODUCT_TYPE[];
}

export const BankConstraintsSchema = SchemaFactory.createForClass(BankConstraintsDocument);
