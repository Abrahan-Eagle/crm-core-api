import { Expose } from 'class-transformer';

export class ContactDocumentResponse {
  @Expose()
  url: string;

  @Expose()
  type: string;
}
