import { Nullable } from '@internal/common';
import { Expose, Type } from 'class-transformer';

import { AddressRequest } from '@/app/common';

import { BankContactRequest } from './bank-contact.request';
import { BankTerritoryRequest } from './bank-territory.request';

export class UpdateRestrictionsByIndustry {
  @Expose({ name: 'minimum_amount' })
  minimumAmount: number;

  @Expose({ name: 'minimum_transactions' })
  minimumTransactions: number;

  @Expose()
  industry: string;
}

export class UpdateBankConstraintsDepositsRequest {
  @Expose({ name: 'minimum_amount' })
  minimumAmount: number;

  @Expose({ name: 'minimum_transactions' })
  minimumTransactions: number;

  @Expose({ name: 'by_industries' })
  @Type(() => UpdateRestrictionsByIndustry)
  byIndustries: UpdateRestrictionsByIndustry[];
}

export class UpdateBankConstraintsRequest {
  @Expose()
  classifications?: string[];

  @Expose()
  @Type(() => BankTerritoryRequest)
  territories?: BankTerritoryRequest[];

  @Expose()
  @Type(() => UpdateBankConstraintsDepositsRequest)
  deposits?: Nullable<UpdateBankConstraintsDepositsRequest>;

  @Expose({ name: 'loan_limit' })
  loanLimit?: number;

  @Expose({ name: 'has_loan_limit' })
  hasLoanLimit: boolean;

  @Expose({ name: 'minimum_loan' })
  minimumLoan: number;

  @Expose({ name: 'minimum_months_in_business' })
  minimumMonthsInBusiness?: number;

  @Expose({ name: 'minimum_daily_balance' })
  minimumDailyBalance?: number;

  @Expose({ name: 'maximum_negative_days' })
  maximumNegativeDays?: number;

  @Expose({ name: 'allowed_industries' })
  allowedIndustries?: string[];

  @Expose({ name: 'supported_ids' })
  supportedIDs?: string[];

  @Expose()
  positions: number[];

  @Expose({ name: 'blocked_products' })
  blockedProducts: string[];
}

export class UpdateBankRequest {
  @Expose({ name: 'name' })
  bankName?: string;

  @Expose({ name: 'bank_type' })
  bankType?: string;

  @Expose({ name: 'manager' })
  manager?: string;

  @Expose({ name: 'address' })
  @Type(() => AddressRequest)
  address?: AddressRequest;

  @Expose({ name: 'contacts' })
  @Type(() => BankContactRequest)
  contacts?: BankContactRequest[];

  @Expose({ name: 'constraints' })
  @Type(() => UpdateBankConstraintsRequest)
  constraints?: UpdateBankConstraintsRequest;
}
