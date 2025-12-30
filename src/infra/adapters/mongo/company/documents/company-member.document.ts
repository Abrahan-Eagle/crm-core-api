import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false, versionKey: false })
export class CompanyMemberDocument {
  @Prop({ required: true, type: Types.ObjectId })
  contact_id: Types.ObjectId;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: Number, min: 0, max: 100 })
  percentage: number;

  @Prop({ required: true, type: Date })
  member_since: Date;
}

export const CompanyMemberSchema = SchemaFactory.createForClass(CompanyMemberDocument);
