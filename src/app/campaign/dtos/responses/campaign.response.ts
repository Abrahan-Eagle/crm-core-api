import { Expose } from 'class-transformer';

import { ExposeId } from '@/infra/common';

export class CampaignResponse {
  @ExposeId()
  id: string;

  @Expose()
  sender: string;

  @Expose()
  subject: string;

  @Expose()
  message: string;

  @Expose()
  pending: number;

  @Expose()
  contacts: number;

  @Expose()
  status: string;
}
