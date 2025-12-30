import { Expose } from 'class-transformer';

export class LeadCreatedResponse {
  @Expose()
  id: string;

  @Expose()
  skipped: number[];
}
