import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import {
  BankDepositConstraintByIndustryDocument,
  BankDepositConstraintByIndustrySchema,
} from './bank-deposit-constraint-by-industry.document';

@Schema({ _id: false, versionKey: false })
export class BankConstraintsDepositDocument {
  @Prop({ required: true, type: Number })
  minimum_amount: number;

  @Prop({ required: true, type: Number })
  minimum_transactions: number;

  @Prop({ required: true, type: [BankDepositConstraintByIndustrySchema], default: [] })
  by_industries: BankDepositConstraintByIndustryDocument[];
}

export const BankConstraintsDepositSchema = SchemaFactory.createForClass(BankConstraintsDepositDocument);
