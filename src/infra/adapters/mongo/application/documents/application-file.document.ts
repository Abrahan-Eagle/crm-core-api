import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'application_document' })
export class ApplicationFileDocument {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ required: true, type: Number })
  transactions: number;

  @Prop({ required: true, type: Number })
  negative_days: number;

  @Prop({ required: false, type: String, default: null })
  period: string | null;
}

export const ApplicationFileSchema = SchemaFactory.createForClass(ApplicationFileDocument);
