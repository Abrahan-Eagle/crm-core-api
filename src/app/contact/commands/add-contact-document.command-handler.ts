import { BaseCommandHandler, CommandHandler, mapToVoid, NotFound, throwIfVoid } from '@internal/common';
import { TransactionService } from '@internal/mongo';
import { Inject } from '@nestjs/common';
import { delayWhen, Observable, tap, zip } from 'rxjs';

import { ENTITY_MEDIA_TYPE, InjectionConstant } from '@/app/common';
import { BufferFile } from '@/domain/common';
import { extractFilename } from '@/domain/common/utils';
import { AddContactDocumentCommand, Contact, ContactRepository } from '@/domain/contact';
import { StorageRepository } from '@/domain/media';

@CommandHandler(AddContactDocumentCommand)
export class AddContactDocumentCommandHandler extends BaseCommandHandler<AddContactDocumentCommand, void> {
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

  handle(command: AddContactDocumentCommand): Observable<void> {
    const { contactId, type, file } = command;
    const documentName = extractFilename(file.name);
    return this.repository.findById(contactId).pipe(
      throwIfVoid(() => NotFound.of(Contact, contactId.toString())),
      tap<Contact>((contact) => contact.addDocument(file, type, documentName).getOrThrow()),
      delayWhen((contact: Contact) =>
        this.transactionService.runInTransaction(() => zip(this.repository.updateOne(contact), this.uploadFile(file))),
      ),
      mapToVoid(),
    );
  }

  uploadFile(file: BufferFile) {
    return this.storage.saveFile(file, ENTITY_MEDIA_TYPE.CONTACT);
  }
}
