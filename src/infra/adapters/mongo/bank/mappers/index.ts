import { BankMapper } from './bank.mapper';
import { BankBlacklistMapper } from './bank-blacklist.mapper';
import { BankConstraintsMapper } from './bank-constraints.mapper';
import { BankConstraintsDepositsMapper } from './bank-constraints-deposits.mapper';
import { BankContactMapper } from './bank-contact.mapper';
import { DepositConstraintByIndustryMapper } from './bank-deposit-constraint-by-industry.mapper';
import { BankFileMapper } from './bank-file.mapper';
import { BankTerritoryMapper } from './bank-territory.mapper';

export * from './bank.mapper';
export * from './bank-blacklist.mapper';
export * from './bank-constraints.mapper';
export * from './bank-constraints-deposits.mapper';
export * from './bank-contact.mapper';
export * from './bank-deposit-constraint-by-industry.mapper';
export * from './bank-file.mapper';
export * from './bank-territory.mapper';

export const BankMappers = [
  BankMapper,
  BankConstraintsMapper,
  BankConstraintsDepositsMapper,
  BankContactMapper,
  DepositConstraintByIndustryMapper,
  BankFileMapper,
  BankTerritoryMapper,
  BankBlacklistMapper,
];
