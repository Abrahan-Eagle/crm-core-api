import { BaseCommandHandler, CommandHandler, NotFound, throwIfVoid } from '@internal/common';
import { Inject } from '@nestjs/common';
import { forkJoin, mergeMap, Observable, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { LeadGroup, LeadsRepository, TransferLeadPropertyCommand } from '@/domain/leads';
import { User, UserRepository } from '@/domain/user';

@CommandHandler(TransferLeadPropertyCommand)
export class TransferLeadPropertyCommandHandler extends BaseCommandHandler<TransferLeadPropertyCommand, void> {
  constructor(
    @Inject(InjectionConstant.LEAD_REPOSITORY)
    private readonly leadRepository: LeadsRepository,
    @Inject(InjectionConstant.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {
    super();
  }

  handle(command: TransferLeadPropertyCommand): Observable<void> {
    const { leadId, userId } = command;
    return forkJoin({
      lead: this.leadRepository
        .findById(leadId)
        .pipe(throwIfVoid<LeadGroup>(() => NotFound.of(LeadGroup, leadId.toString()))),
      user: this.userRepository.findById(userId).pipe(throwIfVoid<User>(() => NotFound.of(User, userId.toString()))),
    }).pipe(
      tap(({ lead }) => lead.transferLead(userId)),
      mergeMap(({ lead }) => this.leadRepository.updateLead(lead)),
    );
  }
}
