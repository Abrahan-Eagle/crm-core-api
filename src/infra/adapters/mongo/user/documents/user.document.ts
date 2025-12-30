import { Nullable } from '@internal/common';
import { updateVersionPlugin } from '@internal/mongo';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { CollectionNames } from '@/app/common';

import { PhoneDocument, PhoneSchema } from '../../common';

@Schema({ collection: CollectionNames.USER, versionKey: 'version' })
export class UserDocument {
  _id: Types.ObjectId;

  @Prop({ required: true, type: String })
  first_name: string;

  @Prop({ required: true, type: String })
  last_name: string;

  @Prop({ required: true, type: String, unique: true })
  email: string;

  @Prop({ required: true, type: String, unique: true })
  referral_id: string;

  @Prop({ required: true, type: [String], default: [] })
  roles: string[];

  @Prop({ required: true, type: [String], default: [] })
  tenants: string[];

  @Prop({ required: false, type: PhoneSchema, default: null })
  phone: PhoneDocument | null;

  @Prop({ required: true, type: Date })
  created_at: Date;

  @Prop({ required: false, type: Date })
  updated_at?: Date;

  @Prop({ required: false, type: Date })
  deleted_at?: Nullable<Date>;

  @Prop({ required: true, type: Number, default: 0 })
  version: number;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument).plugin(updateVersionPlugin);
