import { BaseCommandHandler, CommandHandler, mapToVoid, NotFound, throwIfVoid, validateIf } from '@internal/common';
import { Inject } from '@nestjs/common';
import { mergeMap, Observable, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Note } from '@/domain/common';
import { Company, CompanyRepository, RemoveCompanyNoteCommand } from '@/domain/company';

@CommandHandler(RemoveCompanyNoteCommand)
export class RemoveCompanyNoteCommandHandler extends BaseCommandHandler<RemoveCompanyNoteCommand, void> {
  constructor(
    @Inject(InjectionConstant.COMPANY_REPOSITORY)
    private readonly repository: CompanyRepository,
  ) {
    super();
  }

  handle(command: RemoveCompanyNoteCommand): Observable<void> {
    const { companyId, noteId } = command;
    return this.repository.findById(companyId).pipe(
      throwIfVoid<Company>(() => NotFound.of(Company, companyId.toString())),
      validateIf(
        (company) => company.notes.some((note) => note.id.equals(noteId)),
        () => NotFound.of(Note, noteId.toString()),
      ),
      tap((company) => company.removeNote(noteId).getOrThrow()),
      mergeMap((company) => this.repository.updateOne(company)),
      mapToVoid(),
    );
  }
}
