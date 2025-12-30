import { BaseQueryHandler, QueryHandler } from '@internal/common';
import { PaginatedResponse, PaginationQuery } from '@internal/http';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Aggregate, FilterQuery, Model, PipelineStage } from 'mongoose';
import { map, mergeMap, Observable, of, zip } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { SearchBanksQuery } from '@/domain/bank';
import { BankDocument } from '@/infra/adapters';
import { ExtendedAuthContextStorage } from '@/infra/common';

import { SearchBankResponse } from '../dtos';

@QueryHandler(SearchBanksQuery)
export class SearchBanksQueryHandler extends BaseQueryHandler<SearchBanksQuery, PaginatedResponse<SearchBankResponse>> {
  constructor(
    @InjectModel(InjectionConstant.BANK_MODEL)
    private readonly model: Model<BankDocument>,
    private readonly context: ExtendedAuthContextStorage,
  ) {
    super();
  }

  handle(query: SearchBanksQuery): Observable<PaginatedResponse<SearchBankResponse>> {
    const { pagination } = query;

    return of(this.applyFilters(query)).pipe(
      map((match) => {
        const finalMatch = { ...match, tenant_id: this.context.store.tenantId };

        return new Aggregate<BankDocument>().match(finalMatch).project({
          id: '$_id',
          name: '$bank_name',
          manager: 1,
          bank_type: 1,
          classifications: '$constraints.classifications',
          country_iso_code_2: '$address.country_iso_code_2',
          territories: '$constraints.territories',
          loan_limit: '$constraints.loan_limit',
          has_loan_limit: '$constraints.has_loan_limit',
          minimum_loan: '$constraints.minimum_loan',
          minimum_daily_balance: '$constraints.minimum_daily_balance',
          maximum_negative_days: '$constraints.maximum_negative_days',
          deposits: '$constraints.deposits',
          status: {
            $cond: {
              if: { $ne: ['$blacklist', null] },
              then: 'inactive',
              else: '$status',
            },
          },
          created_at: 1,
          blacklisted: { $toBool: '$blacklist' },
          blacklisted_at: '$blacklist.blacklisted_at',
          note: '$blacklist.note',
        });
      }),
      mergeMap((aggregate) => {
        return zip(this.getBanks(aggregate.pipeline(), pagination), this.getBankCount(aggregate.pipeline()));
      }),
      map(([docs, count]) => {
        return PaginatedResponse.of(
          plainToInstance(SearchBankResponse, docs, { excludeExtraneousValues: true }),
          count,
          pagination,
        );
      }),
    );
  }

  private getBanks(pipeline: PipelineStage[], pagination: PaginationQuery): Observable<BankDocument[]> {
    const { offset, limit } = pagination;
    return of(pipeline).pipe(
      map(() => this.model.aggregate<BankDocument>(pipeline)),
      map((aggregate) => (pagination.hasSortBy() ? aggregate.sort(pagination.getSortObject()) : aggregate)),
      mergeMap((aggregate) => aggregate.skip(offset).limit(limit).exec()),
    );
  }

  private getBankCount(pipeline: PipelineStage[]): Observable<number> {
    return of(pipeline).pipe(
      mergeMap((pipeline) => this.model.aggregate(pipeline).count('count').exec()),
      map(([result]) => result?.count ?? 0),
    );
  }

  private applyFilters(query: SearchBanksQuery): object {
    let match: FilterQuery<BankDocument> = {};

    if (query.blacklisted !== undefined) {
      if (query.blacklisted) {
        match = {
          ...match,
          blacklist: {
            $exists: true,
            $ne: null,
          },
        };
      } else {
        match = {
          ...match,
          $or: [{ blacklist: { $exists: false } }, { blacklist: null }],
        };
      }
    }

    if (query.search) {
      const pattern = new RegExp(query.search, 'i');
      const searchConditions = [
        { bank_name: pattern },
        { manager: pattern },
        { 'contacts.first_name': pattern },
        { 'contacts.last_name': pattern },
      ];

      if (match.$or) {
        match.$and = [{ $or: match.$or }, { $or: searchConditions }];
        delete match.$or;
      } else {
        match.$or = searchConditions;
      }
    }

    const {
      classifications,
      countries,
      territories,
      status,
      supportedIds,
      depositsMinimumTransactions,
      depositsMinimumAmount,
      loanLimit,
      minimumMonthsInBusiness,
      minimumDailyBalance,
      maximumNegativeDays,
      allowedIndustries,
      positions,
      identificationTypes,
      bankType,
    } = query;

    if (classifications) {
      match = {
        ...match,
        'constraints.classifications': {
          $all: classifications,
          $size: classifications.length,
        },
      };
    }

    if (countries) {
      match = {
        ...match,
        'address.country_iso_code_2': {
          $in: countries,
        },
      };
    }

    if (territories) {
      match = {
        ...match,
        'constraints.territories': {
          $all: territories.map((territory) => ({ $elemMatch: { territory: territory } })),
          $size: territories.length,
        },
      };
    }

    if (status) {
      match = {
        ...match,
        status: status,
      };
    }

    if (bankType) {
      match = {
        ...match,
        bank_type: bankType,
      };
    }

    if (supportedIds) {
      match = {
        ...match,
        'constraints.supported_ids': {
          $in: supportedIds,
        },
      };
    }

    if (depositsMinimumTransactions) {
      match = {
        ...match,
        'constraints.deposits.minimum_transactions': {
          $gte: depositsMinimumTransactions,
        },
      };
    }

    if (depositsMinimumAmount) {
      match = {
        ...match,
        'constraints.deposits.minimum_amount': {
          $lte: depositsMinimumAmount,
        },
      };
    }

    if (loanLimit) {
      match = {
        ...match,
        'constraints.loan_limit': {
          $gte: loanLimit,
        },
      };
    }

    if (minimumMonthsInBusiness) {
      match = {
        ...match,
        'constraints.minimum_months_in_business': { $lte: minimumMonthsInBusiness },
      };
    }

    if (minimumDailyBalance) {
      match = {
        ...match,
        'constraints.minimum_daily_balance': { $lte: minimumDailyBalance },
      };
    }

    if (maximumNegativeDays) {
      match = {
        ...match,
        'constraints.maximum_negative_days': { $gte: maximumNegativeDays },
      };
    }

    if (allowedIndustries) {
      match = {
        ...match,
        'constraints.allowed_industries.id': { $in: [allowedIndustries.at(0)?.id] },
      };
    }

    if (positions) {
      match = {
        ...match,
        'constraints.positions': { $in: [positions] },
      };
    }

    if (identificationTypes) {
      match = {
        ...match,
        'constraints.supported_ids': { $in: identificationTypes },
      };
    }

    return { ...match };
  }
}
