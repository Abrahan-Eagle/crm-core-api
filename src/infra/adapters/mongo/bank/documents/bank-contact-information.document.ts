import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { EmailDocument, EmailSchema, PhoneDocument, PhoneSchema } from '../../common';

@Schema({ _id: false, versionKey: false })
export class BankContactDocument {
  @Prop({ required: true, type: String })
  first_name: string;

  @Prop({ required: true, type: String })
  last_name: string;

  @Prop({ required: true, type: [PhoneSchema], default: [] })
  phones: PhoneDocument[];

  @Prop({ required: true, type: [EmailSchema], default: [] })
  emails: EmailDocument[];
}

export const BankContactSchema = SchemaFactory.createForClass(BankContactDocument);
