import { Expose } from 'class-transformer';

export class CreateAffiliateRequest {
  @Expose()
  id: string;

  @Expose()
  email: string;
}
