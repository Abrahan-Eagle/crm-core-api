import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false })
export class BankFileDocument {
  _id: Types.ObjectId;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: Date })
  created_at: Date;
}

export const BankFileSchema = SchemaFactory.createForClass(BankFileDocument);
