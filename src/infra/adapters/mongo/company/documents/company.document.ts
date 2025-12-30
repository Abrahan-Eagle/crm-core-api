import { Nullable } from '@internal/common';
import { updateVersionPlugin } from '@internal/mongo';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { CollectionNames } from '@/app/common';
import { ENTITY_TYPE } from '@/domain/common';

import {
  AddressDocument,
  AddressSchema,
  EmailDocument,
  EmailSchema,
  IndustryDocument,
  IndustrySchema,
  NoteDocument,
  NoteSchema,
  PhoneDocument,
  PhoneSchema,
} from '../../common';
import { CompanyFileDocument, CompanyFileSchema } from './company-file.document';
import { CompanyMemberDocument, CompanyMemberSchema } from './company-member.document';

@Schema({ collection: CollectionNames.COMPANY, versionKey: 'version' })
export class CompanyDocument {
  _id: Types.ObjectId;

  @Prop({ required: true, type: String })
  company_name: string;

  @Prop({ required: false, type: String, default: null })
  dba: Nullable<string>;

  @Prop({ required: true, type: String, unique: true, index: true })
  tax_id: string;

  @Prop({ required: true, type: IndustrySchema, _id: false })
  industry: IndustryDocument;

  @Prop({ required: true, type: String })
  service: string;

  @Prop({ required: true, type: Date })
  creation_date: Date;

  @Prop({ required: true, type: String })
  entity_type: ENTITY_TYPE;

  @Prop({ required: true, type: AddressSchema })
  address: AddressDocument;

  @Prop({ required: true, type: [PhoneSchema], default: [] })
  phone_numbers: PhoneDocument[];

  @Prop({ required: true, type: [EmailSchema], default: [] })
  emails: EmailDocument[];

  @Prop({ required: true, type: [CompanyMemberSchema] })
  members: CompanyMemberDocument[];

  @Prop({ required: false, type: [CompanyFileSchema], default: [] })
  documents: CompanyFileDocument[];

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

export const CompanySchema = SchemaFactory.createForClass(CompanyDocument).plugin(updateVersionPlugin);
