import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { SUPPORTED_CONTACT_FILES } from '@/domain/contact';

@Schema({ versionKey: false })
export class ContactFileDocument {
  _id: Types.ObjectId;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String, enum: SUPPORTED_CONTACT_FILES })
  type: SUPPORTED_CONTACT_FILES;

  @Prop({ required: true, type: Date })
  created_at: Date;
}

export const ContactFileSchema = SchemaFactory.createForClass(ContactFileDocument);
