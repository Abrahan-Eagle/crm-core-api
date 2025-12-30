import { BaseCommandHandler, CommandHandler, NotFound, Result } from '@internal/common';
import { Inject } from '@nestjs/common';
import { delayWhen, map, mergeMap, Observable, of, tap, zip } from 'rxjs';

import { ENTITY_MEDIA_TYPE, InjectionConstant } from '@/app/common';
import { BufferFile, Id } from '@/domain/common';
import { extractFilename } from '@/domain/common/utils';
import { Company, CompanyRepository, CreateCompanyCommand } from '@/domain/company';
import { Contact, ContactRepository } from '@/domain/contact';
import { StorageRepository } from '@/domain/media';

@CommandHandler(CreateCompanyCommand)
export class CreateCompanyCommandHandler extends BaseCommandHandler<CreateCompanyCommand, Id> {
  constructor(
    @Inject(InjectionConstant.CONTACT_REPOSITORY)
    private readonly contactRepository: ContactRepository,
    @Inject(InjectionConstant.STORAGE_REPOSITORY)
    private readonly storage: StorageRepository,
    @Inject(InjectionConstant.COMPANY_REPOSITORY)
    private readonly companyRepository: CompanyRepository,
  ) {
    super();
  }

  handle(command: CreateCompanyCommand): Observable<Id> {
    const { company, files } = command;
    return of(command).pipe(
      tap(({ company, note }) => note && company.addNote(note).getOrThrow()),
      tap(() => {
        // Add documents with their specified types
        const addDocumentResults: Result<void>[] = [];
        Object.entries(files).forEach(([type, fileList]) => {
          fileList.forEach((file: BufferFile) => {
            const documentName = extractFilename(file.name);
            addDocumentResults.push(company.addDocument(file, type, documentName));
          });
        });
        Result.combine(addDocumentResults).getOrThrow();
      }),
      mergeMap(() => this.checkContactsExist(company)),
      delayWhen(() => {
        // Flatten all files for storage
        const allFiles = Object.values(files).flat();
        return zip(
          this.companyRepository.createOne(company),
          ...allFiles.map((file) => this.storage.saveFile(file, ENTITY_MEDIA_TYPE.COMPANY)),
        );
      }),
      map(() => company.id),
    );
  }

  checkContactsExist(company: Company) {
    // Find all contacts by their ids (remove duplicates)
    const contactIds = [...new Set(company.members.map(({ contactId }) => contactId.toString()))].map((value) =>
      Id.load(value),
    );

    return of({}).pipe(
      mergeMap(() => this.contactRepository.findMany(contactIds)),
      map((contacts) =>
        Result.combine(
          contactIds.map((id) => {
            // check if the id is present from existing contacts.
            const contact = contacts.find((contact) => contact.id.toString() === id.toString());
            if (!contact) {
              return Result.fail(NotFound.of(Contact, id.toString()));
            }
            return Result.ok(null);
          }),
        ).getOrThrow(),
      ),
    );
  }
}
