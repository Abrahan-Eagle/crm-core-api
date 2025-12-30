import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class DistributionDocument {
  @Prop({ required: true, type: Types.ObjectId })
  user_id: Types.ObjectId;

  @Prop({ required: true, type: Number })
  amount: number;
}

export const DistributionSchema = SchemaFactory.createForClass(DistributionDocument);
