import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { CollectionNames } from '@/app/common';

@Schema({ collection: CollectionNames.INDUSTRY, versionKey: false })
export class IndustryDocument {
  _id: Types.ObjectId;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  id: string;
}

export const IndustrySchema = SchemaFactory.createForClass(IndustryDocument);
