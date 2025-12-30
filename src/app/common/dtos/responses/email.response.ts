import { Expose } from 'class-transformer';

export class EmailResponse {
  @Expose()
  value: string;
}
