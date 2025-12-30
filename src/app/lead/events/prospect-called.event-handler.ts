import { BaseEventHandler, EventHandler, mapToVoid, NotFound, throwIfVoid } from '@internal/common';
import { Inject } from '@nestjs/common';
import { mergeMap, Observable, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Id } from '@/domain/common';
import { CallLog, LeadsRepository, Prospect, ProspectCalledEvent } from '@/domain/leads';

@EventHandler(ProspectCalledEvent)
export class ProspectCalledEventHandler extends BaseEventHandler<ProspectCalledEvent> {
  constructor(
    @Inject(InjectionConstant.LEAD_REPOSITORY)
    private readonly repository: LeadsRepository,
  ) {
    super();
  }

  handle(event: ProspectCalledEvent): Observable<void> {
    const { userId, prospectId, date } = event;
    return this.repository.getProspectById(Id.load(prospectId)).pipe(
      throwIfVoid<Prospect>(() => NotFound.of(Prospect, prospectId.toString())),
      tap<Prospect>((prospect) => prospect.addCallLog(CallLog.create(Id.load(userId), date).getOrThrow())),
      mergeMap((prospect) => this.repository.updateProspect(prospect)),
      mapToVoid(),
    );
  }
}
