import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';

import { BankConstraintsDeposits } from '@/domain/bank/entities';

import { BankConstraintsDepositDocument } from '../documents';
import { DepositConstraintByIndustryMapper } from './bank-deposit-constraint-by-industry.mapper';

@Injectable()
export class BankConstraintsDepositsMapper extends AbstractMapper<
  BankConstraintsDepositDocument,
  BankConstraintsDeposits
> {
  constructor(private readonly depositConstraintByIndustryMapper: DepositConstraintByIndustryMapper) {
    super();
  }

  map(from: BankConstraintsDepositDocument): BankConstraintsDeposits {
    const byIndustries = this.depositConstraintByIndustryMapper.mapFromList(from.by_industries);
    const BankConstraintsDepositsInstance = class extends BankConstraintsDeposits {
      static load() {
        return new BankConstraintsDeposits(from.minimum_amount, from.minimum_transactions, byIndustries);
      }
    };
    return BankConstraintsDepositsInstance.load();
  }

  reverseMap(from: BankConstraintsDeposits): BankConstraintsDepositDocument {
    const doc = new BankConstraintsDepositDocument();

    doc.minimum_amount = from.minimumAmount;
    doc.minimum_transactions = from.minimumTransactions;
    doc.by_industries = this.depositConstraintByIndustryMapper.reverseMapFromList(from.byIndustries);

    return doc;
  }
}
