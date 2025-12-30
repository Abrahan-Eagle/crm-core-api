import { BaseCommandHandler, CommandHandler, mapToVoid, NotFound, throwIfVoid, validateIf } from '@internal/common';
import { Inject } from '@nestjs/common';
import { mergeMap, Observable, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Note } from '@/domain/common';
import { Contact, ContactRepository, RemoveContactNoteCommand } from '@/domain/contact';

@CommandHandler(RemoveContactNoteCommand)
export class RemoveContactNoteCommandHandler extends BaseCommandHandler<RemoveContactNoteCommand, void> {
  constructor(
    @Inject(InjectionConstant.CONTACT_REPOSITORY)
    private readonly repository: ContactRepository,
  ) {
    super();
  }

  handle(command: RemoveContactNoteCommand): Observable<void> {
    const { contactId, noteId } = command;
    return this.repository.findById(contactId).pipe(
      throwIfVoid<Contact>(() => NotFound.of(Contact, contactId.toString())),
      validateIf(
        (contact) => contact.notes.some((note) => note.id.equals(noteId)),
        () => NotFound.of(Note, noteId.toString()),
      ),
      tap((contact) => contact.removeNote(noteId).getOrThrow()),
      mergeMap((contact) => this.repository.updateOne(contact)),
      mapToVoid(),
    );
  }
}
