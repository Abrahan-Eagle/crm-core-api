import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { CollectionNames } from '@/app/common';

import { NoteDocument, NoteSchema, PhoneDocument, PhoneSchema } from '../../common';
import { CallLogDocument, CallLogSchema } from './call-log.document';

@Schema({ collection: CollectionNames.PROSPECT, versionKey: false })
export class ProspectDocument {
  _id: Types.ObjectId;

  @Prop({ required: false, type: String, dfault: null })
  company: string | null;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: false, type: String, default: null })
  email: string | null;

  @Prop({ required: true, type: PhoneSchema })
  phone: PhoneDocument;

  @Prop({ required: true, type: Types.ObjectId })
  lead_group_id: Types.ObjectId;

  @Prop({ required: false, type: Date, default: null })
  last_call: Date | null;

  @Prop({ required: false, type: [NoteSchema], default: [] })
  notes: NoteDocument[];

  @Prop({ required: false, type: [CallLogSchema], default: [] })
  call_history: CallLogDocument[];

  @Prop({ required: false, type: Date, default: null })
  follow_up_call: Date | null;

  @Prop({ required: false, type: Date })
  updated_at?: Date;
}

export const ProspectSchema = SchemaFactory.createForClass(ProspectDocument);
