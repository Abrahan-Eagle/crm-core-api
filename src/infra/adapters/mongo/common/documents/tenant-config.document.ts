import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { CollectionNames } from '@/app/common';

@Schema({ collection: CollectionNames.TENANT_CONFIG, versionKey: false })
export class TenantConfigDocument {
  @Prop({ required: true, type: String, index: true })
  name: string;

  @Prop({ required: true, type: String })
  theme: string;

  @Prop({ required: true, type: String })
  tenant: string;

  @Prop({ required: true, type: String })
  audience: string;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: true, type: String })
  logo: string;

  @Prop({ required: true, type: String })
  company_name: string;

  @Prop({ required: true, type: Number })
  tag_id: number;

  @Prop({ required: true, type: String })
  phone: string;

  @Prop({ required: true, type: String })
  lang: string;

  @Prop({ required: false, type: String })
  gtm_id?: string;

  @Prop({ required: false, type: String })
  favicon?: string;
}

export const TenantConfigSchema = SchemaFactory.createForClass(TenantConfigDocument);
