import { Expose } from 'class-transformer';

export class BankTerritoryRequest {
  @Expose()
  territory?: string;

  @Expose({ name: 'excluded_states' })
  excludedStates?: string[];
}
