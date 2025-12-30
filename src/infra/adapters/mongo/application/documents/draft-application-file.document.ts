import { Nullable } from '@internal/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class DraftApplicationFileDocument {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ type: Number, required: false, default: null })
  amount: Nullable<number>;

  @Prop({ type: Number, required: false, default: null })
  transactions: Nullable<number>;

  @Prop({ type: Number, required: false, default: null })
  negative_days: Nullable<number>;

  @Prop({ required: true, type: String })
  period: string;
}

export const DraftApplicationFileSchema = SchemaFactory.createForClass(DraftApplicationFileDocument);
