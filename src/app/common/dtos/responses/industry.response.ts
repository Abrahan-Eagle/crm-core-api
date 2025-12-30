import { Expose } from 'class-transformer';

export class IndustryResponse {
  @Expose()
  name: string;

  @Expose()
  id: string;
}
