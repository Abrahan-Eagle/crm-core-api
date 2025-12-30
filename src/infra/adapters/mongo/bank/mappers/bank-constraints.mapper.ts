import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';

import { BankConstraints } from '@/domain/bank/entities';

import { IndustryMapper } from '../../common';
import { BankConstraintsDocument } from '../documents';
import { BankConstraintsDepositsMapper } from './bank-constraints-deposits.mapper';
import { BankTerritoryMapper } from './bank-territory.mapper';

@Injectable()
export class BankConstraintsMapper extends AbstractMapper<BankConstraintsDocument, BankConstraints> {
  constructor(
    private readonly BankConstraintsDepositsMapper: BankConstraintsDepositsMapper,
    private readonly industryMapper: IndustryMapper,
    private readonly territoryMapper: BankTerritoryMapper,
  ) {
    super();
  }

  map(from: BankConstraintsDocument): BankConstraints {
    const deposits = from.deposits ? this.BankConstraintsDepositsMapper.map(from.deposits) : null;
    const allowedIndustries = this.industryMapper.mapFromList(from.allowed_industries);
    const territories = this.territoryMapper.mapFromList(from.territories);

    const BankConstraintsInstance = class extends BankConstraints {
      static load(): BankConstraints {
        return new BankConstraints(
          from.classifications,
          territories,
          deposits,
          from.loan_limit,
          from.has_loan_limit,
          from.minimum_loan,
          from.minimum_months_in_business,
          from.minimum_daily_balance,
          from.maximum_negative_days,
          allowedIndustries,
          from.supported_ids,
          from.positions,
          from.blocked_products,
        );
      }
    };
    return BankConstraintsInstance.load();
  }

  reverseMap(from: BankConstraints): BankConstraintsDocument {
    const doc = new BankConstraintsDocument();
    doc.classifications = from.classifications;
    doc.territories = this.territoryMapper.reverseMapFromList(from.territories);

    doc.deposits = null;
    if (from.deposits) {
      const deposits = this.BankConstraintsDepositsMapper.reverseMap(from.deposits);
      doc.deposits = deposits;
    }

    doc.loan_limit = from.loanLimit;
    doc.has_loan_limit = from.hasLoanLimit;
    doc.minimum_loan = from.minimumLoan;
    doc.minimum_daily_balance = from.minimumDailyBalance;
    doc.maximum_negative_days = from.maximumNegativeDays;
    doc.minimum_months_in_business = from.minimumMonthsInBusiness;
    doc.allowed_industries = this.industryMapper.reverseMapFromList(from.allowedIndustries);
    doc.supported_ids = from.supportedIDs;
    doc.positions = from.positions;
    doc.blocked_products = from.blockedProducts;

    return doc;
  }
}
