import { Expose } from 'class-transformer';

export class TenantConfigResponse {
  @Expose()
  theme: string;

  @Expose()
  email: string;

  @Expose()
  tenant: string;

  @Expose()
  logo: string;

  @Expose()
  company_name: string;

  @Expose()
  phone: string;

  @Expose()
  tag_id: number;

  @Expose()
  access_token: string;

  @Expose()
  audience: number;

  @Expose()
  lang: string;

  @Expose()
  gtm_id?: string;

  @Expose()
  favicon?: string;
}
