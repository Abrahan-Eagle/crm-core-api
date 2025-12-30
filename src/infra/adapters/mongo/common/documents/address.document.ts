import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, versionKey: false })
export class AddressDocument {
  @Prop({ type: String, required: false })
  line_1: string | null;

  @Prop({ type: String, required: false })
  line_2: string | null;

  @Prop({ type: String, required: false })
  state: string | null;

  @Prop({ type: String, required: false })
  city: string | null;

  @Prop({ type: String, required: false })
  zip_code: string | null;

  @Prop({ type: String, required: false })
  country_iso_code_2: string;
}

export const AddressSchema = SchemaFactory.createForClass(AddressDocument);
