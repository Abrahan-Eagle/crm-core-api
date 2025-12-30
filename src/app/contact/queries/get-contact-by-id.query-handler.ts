import { BaseQueryHandler, NotFound, QueryHandler, throwIfVoid } from '@internal/common';
import { Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model, Types } from 'mongoose';
import { map, mergeMap, Observable, of, tap } from 'rxjs';

import { CollectionNames, ENTITY_MEDIA_TYPE, InjectionConstant, MediaConfig } from '@/app/common';
import { UrlSignerService } from '@/domain/common';
import { Contact, GetContactByIdQuery } from '@/domain/contact';
import { ContactDocument } from '@/infra/adapters';
import { ExtendedAuthContextStorage, hasPermission, Permission } from '@/infra/common';

import { ContactResponse } from '../dtos';

@QueryHandler(GetContactByIdQuery)
export class GetContactByIdQueryHandler extends BaseQueryHandler<GetContactByIdQuery, ContactResponse> {
  constructor(
    @InjectModel(InjectionConstant.CONTACT_MODEL)
    private readonly model: Model<ContactDocument>,
    private readonly config: MediaConfig,
    @Inject(InjectionConstant.URL_SIGNER_SERVICE)
    private readonly signer: UrlSignerService,
    private readonly context: ExtendedAuthContextStorage,
  ) {
    super();
  }

  handle(query: GetContactByIdQuery): Observable<ContactResponse> {
    const { uri } = this.config.getMediaConfig(ENTITY_MEDIA_TYPE.CONTACT);
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
          .aggregate<ContactDocument>()
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
            contact: {
              $first: '$$ROOT',
            },
          })
          .replaceRoot({
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
          })
          .exec(),
      ),
      map(([contact]) => contact),
      throwIfVoid(() => NotFound.of(Contact, query.id)),
      tap((contact) => {
        // Flatten emails
        Object.assign(
          contact.emails,
          contact.emails.map((email) => email.value),
        );

        // Set documents URL
        Object.assign(
          contact.documents,
          contact.documents.map((document) => ({
            url: this.signer.sign(`${uri}/${document.name}`),
            _id: document._id,
            type: document.type,
          })),
        );
      }),
      map((contact) =>
        plainToInstance(ContactResponse, contact, {
          excludeExtraneousValues: true,
          hidePhone: !hasPermission(Permission.VIEW_FULL_PHONE, this.context.store.permissions),
          hideEmail: !hasPermission(Permission.VIEW_FULL_EMAIL, this.context.store.permissions),
          hideSSN: !hasPermission(Permission.VIEW_FULL_SSN, this.context.store.permissions),
        } as any),
      ),
    );
  }
}
