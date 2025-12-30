import { BaseCommandHandler, CommandHandler, mapToVoid, NotFound, throwIfVoid } from '@internal/common';
import { Inject } from '@nestjs/common';
import { delayWhen, Observable, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { AddNoteToProspectCommand, LeadsRepository, Prospect } from '@/domain/leads';

@CommandHandler(AddNoteToProspectCommand)
export class AddNoteToProspectCommandHandler extends BaseCommandHandler<AddNoteToProspectCommand, void> {
  constructor(
    @Inject(InjectionConstant.LEAD_REPOSITORY)
    private readonly repository: LeadsRepository,
  ) {
    super();
  }

  handle(command: AddNoteToProspectCommand): Observable<void> {
    const { leadId, prospectId, note, followUpCall } = command;
    return this.repository.getProspectByLeadId(leadId, prospectId).pipe(
      throwIfVoid<Prospect>(() => NotFound.of(Prospect, prospectId.toString())),
      tap((prospect) => prospect.addNote(note).getOrThrow()),
      tap((prospect) => followUpCall && prospect.updateFollowUpCall(followUpCall).getOrThrow()),
      delayWhen((prospect: Prospect) => this.repository.updateProspect(prospect)),
      mapToVoid(),
    );
  }
}
