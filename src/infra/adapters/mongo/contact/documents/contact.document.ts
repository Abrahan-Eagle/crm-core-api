import { Nullable } from '@internal/common';
import { updateVersionPlugin } from '@internal/mongo';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { CollectionNames } from '@/app/common';
import { CONTACT_IDENTIFICATION_TYPE } from '@/domain/contact';

import {
  AddressDocument,
  AddressSchema,
  EmailDocument,
  EmailSchema,
  NoteDocument,
  NoteSchema,
  PhoneDocument,
  PhoneSchema,
} from '../../common';
import { ContactFileDocument, ContactFileSchema } from './contact-file.document';

@Schema({ collection: CollectionNames.CONTACT, versionKey: 'version' })
export class ContactDocument {
  _id: Types.ObjectId;

  @Prop({ required: true, type: String })
  first_name: string;

  @Prop({ required: true, type: String })
  last_name: string;

  @Prop({ required: true, type: Date })
  birthdate: Date;

  @Prop({ required: true, type: String, unique: true, index: true })
  ssn: string;

  @Prop({ required: true, type: String, enum: CONTACT_IDENTIFICATION_TYPE })
  identification_type: CONTACT_IDENTIFICATION_TYPE;

  @Prop({ required: true, type: AddressSchema })
  address: AddressDocument;

  @Prop({ required: true, type: [PhoneSchema], default: [] })
  phones: PhoneDocument[];

  @Prop({ required: true, type: [EmailSchema], default: [] })
  emails: EmailDocument[];

  @Prop({ required: false, type: [ContactFileSchema], default: [] })
  documents: ContactFileDocument[];

  @Prop({ required: false, type: [NoteSchema], default: [] })
  notes: NoteDocument[];

  @Prop({ required: false, type: Types.ObjectId, default: null })
  created_by: Nullable<Types.ObjectId>;

  @Prop({ required: true, type: Date })
  created_at: Date;

  @Prop({ required: false, type: Date })
  updated_at?: Date;

  @Prop({ required: true, type: Number, default: 0 })
  version: number;
}

export const ContactSchema = SchemaFactory.createForClass(ContactDocument).plugin(updateVersionPlugin);
