import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { Injectable } from '@nestjs/common';

import { URLSignerConfig } from '@/app/common';
import { UrlSignerService } from '@/domain/common';

@Injectable()
export class AWSURLSignerService implements UrlSignerService {
  constructor(private readonly config: URLSignerConfig) {}

  sign(url: string, expirationInMinutes: number = 30): string {
    const { keyPairId, privateKey } = this.config;
    return getSignedUrl({
      url,
      keyPairId,
      dateLessThan: this._getExpirationDate(expirationInMinutes),
      privateKey: privateKey,
    });
  }

  private _getExpirationDate(minutes: number): string {
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + minutes);
    return expirationDate.toISOString();
  }
}
