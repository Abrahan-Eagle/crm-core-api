import { BaseCommandHandler, CommandHandler, Id, mapToVoid, Result } from '@internal/common';
import { Inject } from '@nestjs/common';
import { delayWhen, map, Observable, of, tap, zip } from 'rxjs';

import { ENTITY_MEDIA_TYPE, InjectionConstant } from '@/app/common';
import { BufferFile } from '@/domain/common';
import { extractFilename } from '@/domain/common/utils';
import { Contact, ContactRepository, CreateContactCommand, SUPPORTED_CONTACT_FILES } from '@/domain/contact';
import { StorageRepository } from '@/domain/media';

@CommandHandler(CreateContactCommand)
export class CreateContactCommandHandler extends BaseCommandHandler<CreateContactCommand, Id> {
  constructor(
    @Inject(InjectionConstant.CONTACT_REPOSITORY)
    private readonly contactRepository: ContactRepository,
    @Inject(InjectionConstant.STORAGE_REPOSITORY)
    private readonly storage: StorageRepository,
  ) {
    super();
  }

  handle(command: CreateContactCommand): Observable<Id> {
    return of(command).pipe(
      tap(({ contact, note }) => note && contact.addNote(note).getOrThrow()),
      tap(({ contact, files }) =>
        Result.combine(
          Object.keys(files).flatMap((fileType: SUPPORTED_CONTACT_FILES) =>
            files[fileType].map((file) => {
              const documentName = extractFilename(file.name);
              return contact.addDocument(file, fileType, documentName);
            }),
          ),
        ).getOrThrow(),
      ),
      delayWhen<{ contact: Contact; files: { [key in SUPPORTED_CONTACT_FILES]: BufferFile[] } }>(({ contact, files }) =>
        zip(this.contactRepository.createOne(contact), ...this.uploadFiles(files)),
      ),
      map(({ contact }) => contact.id),
    );
  }

  uploadFiles(files: { [key in SUPPORTED_CONTACT_FILES]: BufferFile[] }): Observable<void>[] {
    const flatFiles = Object.entries(files).flatMap(([, streamFiles]) => streamFiles);
    if (flatFiles.length === 0) {
      return [of({}).pipe(mapToVoid())];
    }

    return flatFiles.map((file) => this.storage.saveFile(file, ENTITY_MEDIA_TYPE.CONTACT));
  }
}
