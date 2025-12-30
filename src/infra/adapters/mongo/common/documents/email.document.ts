import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, versionKey: false })
export class EmailDocument {
  @Prop({ required: true, type: String })
  value: string;

  @Prop({ required: true, type: Boolean, default: false })
  verified: boolean;

  @Prop({ required: false, type: Date })
  verified_at: Date | null;
}

export const EmailSchema = SchemaFactory.createForClass(EmailDocument);
