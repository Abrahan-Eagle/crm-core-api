import { BaseQueryHandler, NotFound, QueryHandler, throwIfVoid } from '@internal/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { map, mergeMap, Observable, of } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Contact, GetContactBySSNQuery } from '@/domain/contact';
import { ContactDocument } from '@/infra/adapters';

import { ContactResponse } from '../dtos';

@QueryHandler(GetContactBySSNQuery)
export class GetContactBySSNQueryHandler extends BaseQueryHandler<GetContactBySSNQuery, ContactResponse> {
  constructor(
    @InjectModel(InjectionConstant.CONTACT_MODEL)
    private readonly model: Model<ContactDocument>,
  ) {
    super();
  }

  handle(query: GetContactBySSNQuery): Observable<ContactResponse> {
    const { ssn } = query;
    return of(query).pipe(
      mergeMap(() =>
        this.model
          .aggregate<ContactDocument>()
          .match({ ssn })
          .project({ documents: 0, created_by: 0, notes: 0 })
          .limit(1)
          .exec(),
      ),
      map(([contact]) => contact),
      throwIfVoid(() => NotFound.of(Contact, ssn)),
      map((contact) =>
        plainToInstance(ContactResponse, contact, {
          excludeExtraneousValues: true,
          hidePhone: false,
          hideEmail: false,
          hideSSN: false,
        } as any),
      ),
    );
  }
}
