import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';

import { BankTerritory } from '@/domain/bank/entities';

import { BankTerritoryDocument } from '../documents';

@Injectable()
export class BankTerritoryMapper extends AbstractMapper<BankTerritoryDocument, BankTerritory> {
  map(from: BankTerritoryDocument): BankTerritory {
    const BankTerritoryInstance = class extends BankTerritory {
      static load(): BankTerritory {
        return new BankTerritory(from.territory, from.excluded_states);
      }
    };
    return BankTerritoryInstance.load();
  }

  reverseMap(from: BankTerritory): BankTerritoryDocument {
    const doc = new BankTerritoryDocument();
    doc.territory = from.territory;
    doc.excluded_states = from.excludedStates;

    return doc;
  }
}
