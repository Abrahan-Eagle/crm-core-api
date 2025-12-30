import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';

import { DepositConstraintByIndustry } from '@/domain/bank';

import { IndustryMapper } from '../../common';
import { BankDepositConstraintByIndustryDocument } from '../documents';

@Injectable()
export class DepositConstraintByIndustryMapper extends AbstractMapper<
  BankDepositConstraintByIndustryDocument,
  DepositConstraintByIndustry
> {
  constructor(private readonly industryMapper: IndustryMapper) {
    super();
  }

  map(from: BankDepositConstraintByIndustryDocument): DepositConstraintByIndustry {
    const industry = this.industryMapper.map(from.industry);
    const DepositConstraintByIndustryInstance = class extends DepositConstraintByIndustry {
      static load() {
        return new DepositConstraintByIndustry(from.minimum_amount, from.minimum_transactions, industry);
      }
    };
    return DepositConstraintByIndustryInstance.load();
  }

  reverseMap(from: DepositConstraintByIndustry): BankDepositConstraintByIndustryDocument {
    const doc = new BankDepositConstraintByIndustryDocument();

    doc.minimum_amount = from.minimumAmount;
    doc.minimum_transactions = from.minimumTransactions;
    doc.industry = this.industryMapper.reverseMap(from.industry);

    return doc;
  }
}
