import { Expose, Transform } from 'class-transformer';

export class PhoneResponse {
  @Expose()
  intl_prefix: string;

  @Expose()
  region_code: string;

  @Expose()
  @Transform(({ obj, options }) => {
    const opts = options as any;
    return opts?.hidePhone ? `****${obj.number.slice(-4)}` : obj.number;
  })
  number: string;
}
