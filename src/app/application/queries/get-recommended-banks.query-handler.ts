import { BaseQueryHandler, NotFound, QueryHandler, throwIfVoid, validateIf } from '@internal/common';
import { Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model, Types } from 'mongoose';
import { forkJoin, map, mergeMap, Observable, of } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Application, ApplicationRepository, GetRecommendedBanksQuery } from '@/domain/application';
import { ApplicationPositionNotDefined, Id } from '@/domain/common';
import { Company, CompanyRepository } from '@/domain/company';
import { Contact, ContactRepository } from '@/domain/contact';
import { BankDocument } from '@/infra/adapters';
import { ExtendedAuthContextStorage } from '@/infra/common';

import { RecommendedBankResponse } from '../dtos';

@QueryHandler(GetRecommendedBanksQuery)
export class GetRecommendedBanksQueryHandler extends BaseQueryHandler<
  GetRecommendedBanksQuery,
  RecommendedBankResponse[]
> {
  constructor(
    @Inject(InjectionConstant.COMPANY_REPOSITORY)
    private readonly companyRepository: CompanyRepository,
    @Inject(InjectionConstant.CONTACT_REPOSITORY)
    private readonly contactRepository: ContactRepository,
    @Inject(InjectionConstant.APPLICATION_REPOSITORY)
    private readonly applicationRepository: ApplicationRepository,
    @InjectModel(InjectionConstant.BANK_MODEL)
    private readonly model: Model<BankDocument>,
    private readonly context: ExtendedAuthContextStorage,
  ) {
    super();
  }

  handle(query: GetRecommendedBanksQuery): Observable<RecommendedBankResponse[]> {
    return this.applicationRepository.findById(query.id).pipe(
      throwIfVoid(() => NotFound.of(Application, query.id.toString())),
      validateIf(
        (application) => !!application.position,
        () => new ApplicationPositionNotDefined(),
      ),
      mergeMap((application) =>
        forkJoin({
          application: of(application),
          applications: this.applicationRepository.getActiveApplications(application.period, application.companyId),
          company: this._getCompany(application.companyId),
        }),
      ),
      mergeMap(({ application, applications, company }) =>
        forkJoin({
          contacts: this._getContacts(company.members.map((member) => member.contactId)),
          application: of(application),
          applications: of(applications),
          company: of(company),
        }),
      ),
      mergeMap(({ application, applications, company, contacts }) => {
        return this.model
          .aggregate<BankDocument>()
          .match({
            tenant_id: this.context.store.tenantId,
            _id: {
              $nin: Array.from(
                new Set([
                  ...applications
                    .map((app) =>
                      app.notifications
                        .map((notification) => new Types.ObjectId(notification.bankId.toString()))
                        .flat(),
                    )
                    .flat(),
                  ...application.notifications.map(
                    (notification) => new Types.ObjectId(notification.bankId.toString()),
                  ),
                ]),
              ),
            },
            $and: [
              {
                $or: [{ blacklist: { $exists: false } }, { blacklist: null }],
              },
              {
                $or: [
                  {
                    'constraints.deposits.minimum_amount': {
                      $exists: false,
                    },
                  },
                  {
                    'constraints.deposits.minimum_amount': {
                      $lte: Math.min(...application.bankStatements.map((statement) => statement.amount)),
                    },
                  },
                ],
              },
            ],
            'constraints.loan_limit': { $gte: application.loanAmount },
            'constraints.territories.territory': { $in: [company.address.countryIsoCode2] },
            'constraints.territories.excluded_states': { $ne: [company.address.state] },
            'constraints.allowed_industries.id': { $in: [company.industry.id] },
            'constraints.maximum_negative_days': {
              $gte: Math.max(...application.bankStatements.map((statement) => statement.negativeDays)),
            },
            'constraints.minimum_months_in_business': { $lte: this._getDiffInMonths(company.creationDate) },
            'constraints.positions': { $in: [application.position] },
            'constraints.supported_ids': {
              $in: Array.from(new Set(contacts.map((contact) => contact.identificationType))),
            },
          })
          .match({
            $or: [
              {
                'constraints.deposits.minimum_transactions': {
                  $exists: false,
                },
              },
              {
                'constraints.deposits.minimum_transactions': {
                  $lte: Math.min(...application.bankStatements.map((statement) => statement.transactions)),
                },
              },
            ],
          })
          .exec();
      }),
      map((banks) => plainToInstance(RecommendedBankResponse, banks, { excludeExtraneousValues: true })),
    );
  }

  private _getCompany(companyId: Id): Observable<Company> {
    return this.companyRepository
      .findById(companyId)
      .pipe(throwIfVoid(() => NotFound.of(Company, companyId.toString())));
  }

  private _getContacts(ids: Id[]): Observable<Contact[]> {
    return this.contactRepository.findMany(ids);
  }

  private _getDiffInMonths(startDate: Date, endDate = new Date()): number {
    let months;
    months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months += endDate.getMonth() - startDate.getMonth();
    return months < 0 ? 0 : months;
  }
}
