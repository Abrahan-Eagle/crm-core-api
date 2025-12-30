import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { SUPPORTED_COMPANY_FILES } from '@/domain/company';

@Schema({ versionKey: false })
export class CompanyFileDocument {
  _id: Types.ObjectId;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String, enum: SUPPORTED_COMPANY_FILES })
  type: SUPPORTED_COMPANY_FILES;

  @Prop({ required: true, type: Date })
  created_at: Date;
}

export const CompanyFileSchema = SchemaFactory.createForClass(CompanyFileDocument);
