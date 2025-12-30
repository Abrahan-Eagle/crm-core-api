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
import { AddCompanyNoteCommand, Company, CompanyRepository } from '@/domain/company';

@CommandHandler(AddCompanyNoteCommand)
export class AddCompanyNoteCommandHandler extends BaseCommandHandler<AddCompanyNoteCommand, void> {
  constructor(
    @Inject(InjectionConstant.COMPANY_REPOSITORY)
    private readonly repository: CompanyRepository,
    @Inject(CommonConstant.EVENT_DISPATCHER)
    private readonly dispatcher: EventDispatcher,
  ) {
    super();
  }

  handle(command: AddCompanyNoteCommand): Observable<void> {
    const { companyId, note } = command;
    return this.repository.findById(companyId).pipe(
      throwIfVoid<Company>(() => NotFound.of(Company, companyId.toString())),
      tap((company) => company.addNote(note).getOrThrow()),
      delayWhen((company: Company) => this.repository.updateOne(company)),
      tap(
        (company: Company) =>
          company.createdBy &&
          this.dispatcher.dispatchEventsAsync([
            new NotificationRequestedEvent(
              company.createdBy!.toString(),
              `A note has been added to company ${company.companyName}`,
              `/companies/${company.id.toString()}`,
            ),
          ]),
      ),
      mapToVoid(),
    );
  }
}
