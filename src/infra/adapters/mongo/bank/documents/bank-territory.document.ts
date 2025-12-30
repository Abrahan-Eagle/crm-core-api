import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { BANK_TERRITORY } from '@/domain/bank';

@Schema({ _id: false, versionKey: false })
export class BankTerritoryDocument {
  @Prop({ required: true, type: String, enum: BANK_TERRITORY })
  territory: BANK_TERRITORY;

  @Prop({ required: false, type: [String], default: [] })
  excluded_states: string[];
}

export const BankTerritorySchema = SchemaFactory.createForClass(BankTerritoryDocument);
