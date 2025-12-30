import { Expose } from 'class-transformer';

export class BankTerritoryResponse {
  @Expose()
  territory: string;

  @Expose()
  excluded_states: string[];
}
