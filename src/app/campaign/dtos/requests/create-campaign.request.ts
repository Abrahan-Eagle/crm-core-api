import { Expose } from 'class-transformer';

export class CreateCampaignRequest {
  @Expose()
  id: string;

  @Expose()
  sender: string;

  @Expose()
  subject: string;

  @Expose()
  message: string;
}
