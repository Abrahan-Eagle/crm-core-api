import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'filled_application_document' })
export class FilledApplicationFileDocument {
  @Prop({ required: true, type: String })
  name: string;
}

export const FilledApplicationFileSchema = SchemaFactory.createForClass(FilledApplicationFileDocument);
