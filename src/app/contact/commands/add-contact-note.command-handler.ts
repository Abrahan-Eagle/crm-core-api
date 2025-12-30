import {
  BaseCommandHandler,
  CommandHandler,
  CommonConstant,
  EventDispatcher,
  mapToVoid,
  NotFound,
  throwIfVoid,
} from '@internal/common';
import { Inject } from '@nestjs/common';
import { delayWhen, Observable, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { NotificationRequestedEvent } from '@/domain/common';
import { AddContactNoteCommand, Contact, ContactRepository } from '@/domain/contact';

@CommandHandler(AddContactNoteCommand)
export class AddContactNoteCommandHandler extends BaseCommandHandler<AddContactNoteCommand, void> {
  constructor(
    @Inject(InjectionConstant.CONTACT_REPOSITORY)
    private readonly repository: ContactRepository,
    @Inject(CommonConstant.EVENT_DISPATCHER)
    private readonly dispatcher: EventDispatcher,
  ) {
    super();
  }

  handle(command: AddContactNoteCommand): Observable<void> {
    const { contactId, note } = command;
    return this.repository.findById(contactId).pipe(
      throwIfVoid<Contact>(() => NotFound.of(Contact, contactId.toString())),
      tap((contact) => contact.addNote(note).getOrThrow()),
      delayWhen((contact: Contact) => this.repository.updateOne(contact)),
      tap(
        (contact: Contact) =>
          contact.createdBy &&
          this.dispatcher.dispatchEventsAsync([
            new NotificationRequestedEvent(
              contact.createdBy!.toString(),
              `A note has been added to contact ${contact.firstName} ${contact.lastName}`,
              `/contacts/${contact.id.toString()}`,
            ),
          ]),
      ),
      mapToVoid(),
    );
  }
}
