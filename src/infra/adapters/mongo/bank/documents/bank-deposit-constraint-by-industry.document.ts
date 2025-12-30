import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IndustryDocument, IndustrySchema } from '../../common';

@Schema({ _id: false, versionKey: false })
export class BankDepositConstraintByIndustryDocument {
  @Prop({ required: true, type: Number })
  minimum_amount: number;

  @Prop({ required: true, type: Number })
  minimum_transactions: number;

  @Prop({ required: true, type: IndustrySchema, _id: false })
  industry: IndustryDocument;
}

export const BankDepositConstraintByIndustrySchema = SchemaFactory.createForClass(
  BankDepositConstraintByIndustryDocument,
);
