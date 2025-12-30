import { BaseQueryHandler, NotFound, QueryHandler, throwIfVoid } from '@internal/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { map, mergeMap, Observable, of, tap } from 'rxjs';

import { CollectionNames, InjectionConstant } from '@/app/common';
import { Company, GetCompanyByTaxIdQuery } from '@/domain/company';
import { CompanyDocument } from '@/infra/adapters';

import { CompanyResponse } from '../dtos';

@QueryHandler(GetCompanyByTaxIdQuery)
export class GetCompanyByTaxIdQueryHandler extends BaseQueryHandler<GetCompanyByTaxIdQuery, CompanyResponse> {
  constructor(
    @InjectModel(InjectionConstant.COMPANY_MODEL)
    private readonly model: Model<CompanyDocument>,
  ) {
    super();
  }

  handle(query: GetCompanyByTaxIdQuery): Observable<CompanyResponse> {
    return of(query).pipe(
      mergeMap(({ taxId }) =>
        this.model
          .aggregate<CompanyDocument>()
          .match({ tax_id: taxId.toString() })
          .unwind({
            path: '$members',
            preserveNullAndEmptyArrays: true,
          })
          .lookup({
            from: CollectionNames.CONTACT,
            localField: 'members.contact_id',
            foreignField: '_id',
            as: 'member_contact',
            pipeline: [
              {
                $project: {
                  first_name: 1,
                  last_name: 1,
                  emails: 1,
                  phones: 1,
                },
              },
            ],
          })
          .unwind({
            path: '$member_contact',
            preserveNullAndEmptyArrays: true,
          })
          .project({
            _id: 1,
            members: {
              contact: '$member_contact',
              title: '$members.title',
              percentage: '$members.percentage',
              member_since: '$members.member_since',
            },
            company: '$$ROOT',
          })
          .group({
            _id: '$_id',
            members: { $push: '$members' },
            company: { $first: '$company' },
          })
          .project({
            id: '$_id',
            name: '$company.company_name',
            dba: '$company.dba',
            tax_id: '$company.tax_id',
            entity_type: '$company.entity_type',
            members: 1,
            address: '$company.address',
          })
          .exec(),
      ),
      map(([company]) => company),
      throwIfVoid(() => NotFound.of(Company, query.taxId.toString())),
      tap((company) => {
        // Flatten emails
        Object.assign(
          company.members,
          company.members.map((member) => ({
            ...member,
            contact: {
              ...(member as any).contact,
              emails: (member as any).contact.emails.map((email: { value: string }) => email.value),
            },
          })),
        );
      }),
      map((company) =>
        plainToInstance(CompanyResponse, company, {
          excludeExtraneousValues: true,
          hidePhone: false,
          hideEmail: false,
          hideTaxId: false,
        } as any),
      ),
    );
  }
}
