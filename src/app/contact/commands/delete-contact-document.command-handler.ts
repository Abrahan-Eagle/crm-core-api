import { BaseCommandHandler, CommandHandler, mapToVoid, NotFound, throwIfVoid, validateIf } from '@internal/common';
import { TransactionService } from '@internal/mongo';
import { Inject } from '@nestjs/common';
import { delayWhen, map, Observable, tap, zip } from 'rxjs';

import { ENTITY_MEDIA_TYPE, InjectionConstant } from '@/app/common';
import { Contact, ContactDocument, ContactRepository, DeleteContactDocumentCommand } from '@/domain/contact';
import { StorageRepository } from '@/domain/media';

@CommandHandler(DeleteContactDocumentCommand)
export class DeleteContactDocumentCommandHandler extends BaseCommandHandler<DeleteContactDocumentCommand, void> {
  constructor(
    @Inject(InjectionConstant.CONTACT_REPOSITORY)
    private readonly repository: ContactRepository,
    @Inject(InjectionConstant.STORAGE_REPOSITORY)
    private readonly storage: StorageRepository,
    @Inject(InjectionConstant.TRANSACTION_SERVICE)
    private readonly transactionService: TransactionService,
  ) {
    super();
  }

  handle(command: DeleteContactDocumentCommand): Observable<void> {
    const { contactId, documentId } = command;
    return this.repository.findById(contactId).pipe(
      throwIfVoid(() => NotFound.of(Contact, contactId.toString())),
      map((contact) => ({
        contact,
        document: contact.documents.find((document) => document.id.equals(documentId)),
      })),
      validateIf(
        ({ document }) => document !== null && document !== undefined,
        () => NotFound.of(ContactDocument, documentId.toString()),
      ),
      tap(({ contact }) => contact.removeDocument(documentId).getOrThrow()),
      delayWhen<{ contact: Contact; document: ContactDocument }>(({ contact, document }) =>
        this.transactionService.runInTransaction(() =>
          zip(this.repository.updateOne(contact), this.storage.deleteFile(document.name, ENTITY_MEDIA_TYPE.CONTACT)),
        ),
      ),
      mapToVoid(),
    );
  }
}
