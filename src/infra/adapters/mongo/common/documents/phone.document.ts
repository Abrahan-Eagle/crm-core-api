import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, versionKey: false })
export class PhoneDocument {
  @Prop({ required: true, type: String })
  intl_prefix: string;

  @Prop({ required: true, type: String })
  region_code: string;

  @Prop({ required: true, type: String })
  number: string;
}

export const PhoneSchema = SchemaFactory.createForClass(PhoneDocument);
