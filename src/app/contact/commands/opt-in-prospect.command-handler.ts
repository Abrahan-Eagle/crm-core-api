import { BaseCommandHandler, CommandHandler, CommonConstant, EventDispatcher } from '@internal/common';
import { Inject } from '@nestjs/common';
import { delayWhen, iif, map, mergeMap, Observable, of, tap } from 'rxjs';

import { ExternalContactsConfig, InjectionConstant } from '@/app/common';
import { ProspectCreatedEvent } from '@/domain/application';
import { ExternalContactsRepository, OptInProspectCommand } from '@/domain/contact';

@CommandHandler(OptInProspectCommand)
export class OptInProspectCommandHandler extends BaseCommandHandler<OptInProspectCommand, { id: number }> {
  constructor(
    @Inject(InjectionConstant.EXTERNAL_CONTACTS_REPOSITORY)
    private readonly repository: ExternalContactsRepository,
    @Inject(CommonConstant.EVENT_DISPATCHER)
    private readonly dispatcher: EventDispatcher,
    private readonly config: ExternalContactsConfig,
  ) {
    super();
  }

  handle(command: OptInProspectCommand) {
    return this.repository.getProspectId(command.email, command.audience).pipe(
      mergeMap((prospectId) =>
        iif(
          () => prospectId !== null,
          of(prospectId).pipe(map((id: number) => ({ id }))),
          this.createProspect(command),
        ),
      ),
      tap(() => {
        return this.dispatcher.dispatchEventsAsync([
          new ProspectCreatedEvent(
            command.firstName,
            command.lastName,
            command.loanAmount,
            `${command.phone.intlPrefix}${command.phone.number}`,
            command.email.value,
            command.referral?.source || null,
            command.referral?.reference || null,
          ),
        ]);
      }),
    );
  }

  createProspect(command: OptInProspectCommand): Observable<{ id: number }> {
    return this.repository
      .optInProspect(
        {
          email: command.email.value,
          first_name: command.firstName,
          last_name: command.lastName,
          phone: command.phone,
          lang: command.lang,
          looking_for: command.loanAmount,
          referral: command.referral,
        },
        command.audience,
      )
      .pipe(
        delayWhen<number>((prospectId) =>
          this.repository.addTag(prospectId, this.config.secret[command.audience].abandoned_tag, command.audience),
        ),
        map((id) => ({ id })),
      );
  }
}
