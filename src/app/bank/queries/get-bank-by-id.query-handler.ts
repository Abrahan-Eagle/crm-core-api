import { BaseQueryHandler, NotFound, QueryHandler, throwIfVoid } from '@internal/common';
import { Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model, Types } from 'mongoose';
import { map, mergeMap, Observable, of, tap } from 'rxjs';

import { ENTITY_MEDIA_TYPE, InjectionConstant, MediaConfig } from '@/app/common';
import { Bank, GetBankByIdQuery } from '@/domain/bank';
import { UrlSignerService } from '@/domain/common';
import { BankDocument } from '@/infra/adapters';
import { ExtendedAuthContextStorage, hasPermission, Permission } from '@/infra/common';

import { BankResponse } from '../dtos';

@QueryHandler(GetBankByIdQuery)
export class GetBankByIdQueryHandler extends BaseQueryHandler<GetBankByIdQuery, BankResponse> {
  constructor(
    @InjectModel(InjectionConstant.BANK_MODEL)
    private readonly model: Model<BankDocument>,
    private readonly config: MediaConfig,
    private readonly context: ExtendedAuthContextStorage,
    @Inject(InjectionConstant.URL_SIGNER_SERVICE)
    private readonly signer: UrlSignerService,
  ) {
    super();
  }

  handle(query: GetBankByIdQuery): Observable<BankResponse> {
    const { uri } = this.config.getMediaConfig(ENTITY_MEDIA_TYPE.BANK);
    return of(query).pipe(
      map(({ id }) => ({
        _id: new Types.ObjectId(id.toString()),
      })),
      mergeMap(({ _id }) =>
        this.model.aggregate<BankDocument>().match({ _id, tenant_id: this.context.store.tenantId }).limit(1).exec(),
      ),
      map(([bank]) => bank),
      throwIfVoid(() => NotFound.of(Bank, query.id)),
      tap((bank) => {
        // Flatten emails
        bank.contacts.forEach((contact) =>
          Object.assign(contact, { emails: contact.emails.map((email) => email.value) }),
        );
        // Set documents URL
        Object.assign(
          bank.documents,
          bank.documents.map((document) => ({ url: this.signer.sign(`${uri}/${document.name}`), _id: document._id })),
        );
      }),
      map((bank) =>
        plainToInstance(BankResponse, bank, {
          excludeExtraneousValues: true,
          hidePhone: !hasPermission(Permission.VIEW_FULL_PHONE, this.context.store.permissions),
          hideEmail: !hasPermission(Permission.VIEW_FULL_EMAIL, this.context.store.permissions),
        } as any),
      ),
    );
  }
}
