import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { DistributionDocument, DistributionSchema } from './distribution.document';

@Schema()
export class CommissionDetailDocument {
  @Prop({ required: true, type: Number })
  total: number;

  @Prop({ required: true, type: Number })
  earnings: number;

  @Prop({ required: true, type: [DistributionSchema] })
  distribution: DistributionDocument[];

  @Prop({ type: Boolean, default: false })
  blocked: boolean;
}

export const CommissionDetailSchema = SchemaFactory.createForClass(CommissionDetailDocument);
