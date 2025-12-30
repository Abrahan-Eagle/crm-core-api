import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'application_referral' })
export class ApplicationReferralDocument {
  @Prop({ required: true, type: String })
  source: string;

  @Prop({ required: false, type: String, default: null })
  reference: string | null;
}

export const ApplicationReferralSchema = SchemaFactory.createForClass(ApplicationReferralDocument);
