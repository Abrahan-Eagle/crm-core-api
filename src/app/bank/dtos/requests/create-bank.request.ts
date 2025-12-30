import { Nullable } from '@internal/common';
import { Expose, Type } from 'class-transformer';

import { AddressRequest } from '@/app/common';

import { BankContactRequest } from './bank-contact.request';
import { BankTerritoryRequest } from './bank-territory.request';

export class RestrictionsByIndustry {
  @Expose({ name: 'minimum_amount' })
  minimumAmount: number;

  @Expose({ name: 'minimum_transactions' })
  minimumTransactions: number;

  @Expose()
  industry: string;
}

export class BankConstraintsDepositsRequest {
  @Expose({ name: 'minimum_amount' })
  minimumAmount: number;

  @Expose({ name: 'minimum_transactions' })
  minimumTransactions: number;

  @Expose({ name: 'by_industries' })
  @Type(() => RestrictionsByIndustry)
  byIndustries: RestrictionsByIndustry[];
}

export class BankConstraintsRequest {
  @Expose()
  classifications: string[];

  @Expose()
  @Type(() => BankTerritoryRequest)
  territories: BankTerritoryRequest[];

  @Expose()
  @Type(() => BankConstraintsDepositsRequest)
  deposits?: Nullable<BankConstraintsDepositsRequest>;

  @Expose({ name: 'loan_limit' })
  loanLimit?: number;

  @Expose({ name: 'has_loan_limit' })
  hasLoanLimit: boolean;

  @Expose({ name: 'minimum_loan' })
  minimumLoan: number;

  @Expose({ name: 'minimum_months_in_business' })
  minimumMonthsInBusiness: number;

  @Expose({ name: 'minimum_daily_balance' })
  minimumDailyBalance: number;

  @Expose({ name: 'maximum_negative_days' })
  maximumNegativeDays: number;

  @Expose({ name: 'allowed_industries' })
  allowedIndustries: string[];

  @Expose({ name: 'supported_ids' })
  supportedIDs: string[];

  @Expose()
  positions: number[];

  @Expose({ name: 'blocked_products' })
  blockedProducts: string[];
}

export class CreateBankRequest {
  @Expose()
  id: string;

  @Expose({ name: 'name' })
  bankName: string;

  @Expose({ name: 'bank_type' })
  bankType: string;

  @Expose()
  manager: string;

  @Expose()
  @Type(() => AddressRequest)
  address: AddressRequest;

  @Expose()
  @Type(() => BankContactRequest)
  contacts: BankContactRequest[];

  @Expose()
  @Type(() => BankConstraintsRequest)
  constraints: BankConstraintsRequest;
}
