import { BaseCommandHandler, CommandHandler, mapToVoid, NotFound, throwIfVoid } from '@internal/common';
import { Inject } from '@nestjs/common';
import { mergeMap, Observable, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Contact, ContactRepository, UpdateContactCommand } from '@/domain/contact';

@CommandHandler(UpdateContactCommand)
export class UpdateContactCommandHandler extends BaseCommandHandler<UpdateContactCommand, void> {
  constructor(
    @Inject(InjectionConstant.CONTACT_REPOSITORY)
    private readonly repository: ContactRepository,
  ) {
    super();
  }

  handle(command: UpdateContactCommand): Observable<void> {
    const { contactId } = command;
    return this.repository.findById(contactId).pipe(
      throwIfVoid(() => NotFound.of(Contact, contactId.toString())),
      tap<Contact>((contact) => this.updateFields(command, contact)),
      mergeMap((contact) => this.repository.updateOne(contact)),
      mapToVoid(),
    );
  }

  private updateFields(command: UpdateContactCommand, contact: Contact) {
    contact
      .updateContact({
        firstName: command?.firstName,
        lastName: command?.lastName,
        birthdate: command?.birthdate,
        address: command?.address,
        phones: command?.phones,
        emails: command?.emails,
      })
      .getOrThrow();
  }
}
