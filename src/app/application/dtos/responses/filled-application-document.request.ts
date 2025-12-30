import { Expose } from 'class-transformer';

export class FilledApplicationDocumentResponse {
  @Expose()
  url: string;
}
