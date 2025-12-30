import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class BankBlacklistDocument {
  @Prop({ required: true, type: Date })
  blacklisted_at: Date;

  @Prop({ required: true, type: Types.ObjectId })
  blacklisted_by: Types.ObjectId;

  @Prop({ required: true, type: String })
  note: string;
}

export const BankBlacklistSchema = SchemaFactory.createForClass(BankBlacklistDocument);
