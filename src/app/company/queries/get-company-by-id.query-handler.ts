import { BaseQueryHandler, NotFound, QueryHandler, throwIfVoid } from '@internal/common';
import { Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model, Types } from 'mongoose';
import { map, mergeMap, Observable, of, tap } from 'rxjs';

import { CollectionNames, ENTITY_MEDIA_TYPE, InjectionConstant, MediaConfig } from '@/app/common';
import { UrlSignerService } from '@/domain/common';
import { Company, GetCompanyByIdQuery } from '@/domain/company';
import { CompanyDocument } from '@/infra/adapters';
import { ExtendedAuthContextStorage, hasPermission, Permission } from '@/infra/common';

import { CompanyResponse } from '../dtos';

@QueryHandler(GetCompanyByIdQuery)
export class GetCompanyByIdQueryHandler extends BaseQueryHandler<GetCompanyByIdQuery, CompanyResponse> {
  constructor(
    @InjectModel(InjectionConstant.COMPANY_MODEL)
    private readonly model: Model<CompanyDocument>,
    private readonly config: MediaConfig,
    @Inject(InjectionConstant.URL_SIGNER_SERVICE)
    private readonly signer: UrlSignerService,
    private readonly context: ExtendedAuthContextStorage,
  ) {
    super();
  }

  handle(query: GetCompanyByIdQuery): Observable<CompanyResponse> {
    const { uri } = this.config.getMediaConfig(ENTITY_MEDIA_TYPE.COMPANY);
    return of(query).pipe(
      map(({ id }) =>
        query.onlyMine
          ? {
              _id: new Types.ObjectId(id.toString()),
              created_by: new Types.ObjectId(this.context.store.userId),
            }
          : {
              _id: new Types.ObjectId(id.toString()),
            },
      ),
      mergeMap(({ _id }) =>
        this.model
          .aggregate<CompanyDocument>()
          .match({ _id })
          .limit(1)
          .lookup({
            from: CollectionNames.USER,
            localField: 'created_by',
            foreignField: '_id',
            as: 'created_by',
            pipeline: [{ $project: { first_name: 1, last_name: 1 } }],
          })
          .unwind({
            path: '$created_by',
            preserveNullAndEmptyArrays: true,
          })
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
                $unwind: {
                  path: '$notes',
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $lookup: {
                  from: CollectionNames.USER,
                  localField: 'notes.author',
                  foreignField: '_id',
                  as: 'notes.author',
                  pipeline: [
                    {
                      $project: {
                        first_name: 1,
                        last_name: 1,
                      },
                    },
                  ],
                },
              },
              {
                $unwind: {
                  path: '$notes.author',
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $group: {
                  _id: '$_id',
                  notes: {
                    $push: '$notes',
                  },
                  contact: {
                    $first: '$$ROOT',
                  },
                },
              },
              {
                $replaceRoot: {
                  newRoot: {
                    $mergeObjects: [
                      '$contact',
                      {
                        notes: {
                          $filter: {
                            input: '$notes',
                            as: 'note',
                            cond: { $ne: ['$$note', {}] },
                          },
                        },
                      },
                    ],
                  },
                },
              },
              {
                $project: {
                  first_name: 1,
                  last_name: 1,
                  notes: 1,
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
            industry: '$company.industry',
            creation_date: '$company.creation_date',
            entity_type: '$company.entity_type',
            phone_numbers: '$company.phone_numbers',
            emails: '$company.emails',
            documents: '$company.documents',
            address: '$company.address',
            created_by: '$company.created_by',
            created_at: '$company.created_at',
            members: 1,
            service: '$company.service',
            notes: '$company.notes',
          })
          .unwind({
            path: '$notes',
            preserveNullAndEmptyArrays: true,
          })
          .lookup({
            from: CollectionNames.USER,
            localField: 'notes.author',
            foreignField: '_id',
            as: 'notes.author',
            pipeline: [{ $project: { first_name: 1, last_name: 1 } }],
          })
          .unwind({
            path: '$notes.author',
            preserveNullAndEmptyArrays: true,
          })
          .group({
            _id: '$_id',
            notes: {
              $push: '$notes',
            },
            company: {
              $first: '$$ROOT',
            },
          })
          .replaceRoot({
            $mergeObjects: [
              '$company',
              {
                notes: {
                  $filter: {
                    input: '$notes',
                    as: 'note',
                    cond: { $ne: ['$$note', {}] },
                  },
                },
              },
            ],
          })
          .exec(),
      ),
      map(([company]) => company),
      throwIfVoid(() => NotFound.of(Company, query.id)),
      tap((company) => {
        // Flatten emails
        Object.assign(
          company.emails,
          company.emails.map((email) => email.value),
        );
        // Set documents URL
        Object.assign(
          company.documents,
          company.documents.map((document) => ({
            url: this.signer.sign(`${uri}/${document.name}`),
            _id: document._id,
            type: document.type,
          })),
        );
      }),
      map((company) =>
        plainToInstance(CompanyResponse, company, {
          excludeExtraneousValues: true,
          hidePhone: !hasPermission(Permission.VIEW_FULL_PHONE, this.context.store.permissions),
          hideEmail: !hasPermission(Permission.VIEW_FULL_EMAIL, this.context.store.permissions),
          hideTaxId: !hasPermission(Permission.VIEW_FULL_TAX_ID, this.context.store.permissions),
        } as any),
      ),
    );
  }
}
