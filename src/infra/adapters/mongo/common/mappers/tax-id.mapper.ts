import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';

import { TaxId } from '@/domain/common';

@Injectable()
export class TaxIdMapper extends AbstractMapper<string, TaxId> {
  map(from: string): TaxId {
    const TaxIdInstance = class extends TaxId {
      static load(): TaxId {
        return new TaxId(from);
      }
    };
    return TaxIdInstance.load();
  }

  reverseMap(from: TaxId): string {
    return from.toString();
  }
}
