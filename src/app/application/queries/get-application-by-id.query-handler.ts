import { BaseQueryHandler, NotFound, QueryHandler, throwIfVoid } from '@internal/common';
import { Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model, Types } from 'mongoose';
import { map, mergeMap, Observable, of, tap } from 'rxjs';

import { CollectionNames, ENTITY_MEDIA_TYPE, InjectionConstant, MediaConfig } from '@/app/common';
import { Application, GetApplicationByIdQuery } from '@/domain/application';
import { UrlSignerService } from '@/domain/common';
import { ApplicationDocument, CompanyDocument } from '@/infra/adapters';
import { ExtendedAuthContextStorage, hasPermission, Permission } from '@/infra/common';

import { ApplicationResponse } from '../dtos';

@QueryHandler(GetApplicationByIdQuery)
export class GetApplicationByIdQueryHandler extends BaseQueryHandler<GetApplicationByIdQuery, ApplicationResponse> {
  constructor(
    @InjectModel(InjectionConstant.APPLICATION_MODEL)
    private readonly model: Model<ApplicationDocument>,
    private readonly config: MediaConfig,
    private readonly context: ExtendedAuthContextStorage,
    @Inject(InjectionConstant.URL_SIGNER_SERVICE)
    private readonly signer: UrlSignerService,
  ) {
    super();
  }

  handle(query: GetApplicationByIdQuery): Observable<ApplicationResponse> {
    const { uri: appURI } = this.config.getMediaConfig(ENTITY_MEDIA_TYPE.APPLICATION);
    const { uri: companyURI } = this.config.getMediaConfig(ENTITY_MEDIA_TYPE.COMPANY);
    return of(query).pipe(
      map(({ id }) => ({
        _id: new Types.ObjectId(id.toString()),
      })),
      mergeMap(({ _id }) =>
        this.model
          .aggregate<ApplicationDocument>()
          .match(
            query.onlyMine
              ? {
                  _id,
                  tenant_id: this.context.store.tenantId,
                  created_by: new Types.ObjectId(this.context.store.userId),
                }
              : { _id, tenant_id: this.context.store.tenantId },
          )
          .lookup({
            from: CollectionNames.COMPANY,
            localField: 'company_id',
            foreignField: '_id',
            as: 'company',
            pipeline: [
              {
                $unwind: {
                  path: '$members',
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $lookup: {
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
                        pipeline: [{ $project: { first_name: 1, last_name: 1 } }],
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
                },
              },
              {
                $unwind: {
                  path: '$member_contact',
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $project: {
                  _id: 1,
                  members: {
                    contact: '$member_contact',
                    title: '$members.title',
                    percentage: '$members.percentage',
                    member_since: '$members.member_since',
                  },
                  company: '$$ROOT',
                },
              },
              {
                $group: {
                  _id: '$_id',
                  members: { $push: '$members' },
                  company: { $first: '$company' },
                },
              },
              {
                $project: {
                  id: '$_id',
                  name: '$company.company_name',
                  dba: '$company.dba',
                  phone_numbers: '$company.phone_numbers',
                  emails: '$company.emails',
                  documents: '$company.documents',
                  address: '$company.address',
                  members: 1,
                  notes: '$company.notes',
                },
              },
              {
                $unwind: {
                  path: '$notes',
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $lookup: {
                  from: 'users',
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
                  company: {
                    $first: '$$ROOT',
                  },
                },
              },
              {
                $replaceRoot: {
                  newRoot: {
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
                  },
                },
              },
            ],
          })
          .unwind({
            path: '$company',
            preserveNullAndEmptyArrays: false,
          })

          .lookup({
            from: CollectionNames.USER,
            localField: 'created_by',
            foreignField: '_id',
            as: 'created_by',
            pipeline: [
              {
                $project: {
                  first_name: 1,
                  last_name: 1,
                },
              },
            ],
          })
          .unwind({
            path: '$created_by',
            preserveNullAndEmptyArrays: true,
          })
          .exec(),
      ),
      map(([application]) => application),
      throwIfVoid(() => NotFound.of(Application, query.id)),
      tap((app: ApplicationDocument & { company: CompanyDocument }) => {
        // Flatten emails
        Object.assign(
          app.company.emails,
          app.company.emails.map((email) => email.value),
        );

        // Set company documents URL
        Object.assign(
          app.company.documents,
          app.company.documents.map((document) => ({
            url: this.signer.sign(`${companyURI}/${document.name}`),
            _id: document._id,
            type: document.type,
          })),
        );

        // Set app documents URL
        Object.assign(
          app.filled_applications,
          app.filled_applications.map((document) => ({ url: this.signer.sign(`${appURI}/${document.name}`) })),
        );

        Object.assign(
          app.additional_statements,
          app.additional_statements.map((document) => ({
            url: this.signer.sign(`${appURI}/${document.name}`),
            ...document,
          })),
        );

        Object.assign(
          app.credit_card_statements,
          app.credit_card_statements.map((document) => ({
            url: this.signer.sign(`${appURI}/${document.name}`),
            ...document,
          })),
        );

        Object.assign(
          app.mtd_statements,
          app.mtd_statements.map((document) => ({ url: this.signer.sign(`${appURI}/${document.name}`), ...document })),
        );

        Object.assign(
          app.bank_statements,
          app.bank_statements.map((document) => ({ url: this.signer.sign(`${appURI}/${document.name}`), ...document })),
        );
      }),
      map((app) =>
        plainToInstance(ApplicationResponse, app, {
          excludeExtraneousValues: true,
          hidePhone: !hasPermission(Permission.VIEW_FULL_PHONE, this.context.store.permissions),
          hideEmail: !hasPermission(Permission.VIEW_FULL_EMAIL, this.context.store.permissions),
        } as any),
      ),
    );
  }
}
