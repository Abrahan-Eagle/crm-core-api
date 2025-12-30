import { BaseCommandHandler, CommandHandler, NotFound, throwIfVoid } from '@internal/common';
import { TransactionService } from '@internal/mongo';
import { Inject } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { delayWhen, map, Observable, zip } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { CreateLeadCommand, LeadsRepository } from '@/domain/leads';
import { User, UserRepository } from '@/domain/user';

import { LeadCreatedResponse } from '../dtos';

@CommandHandler(CreateLeadCommand)
export class CreateLeadCommandHandler extends BaseCommandHandler<CreateLeadCommand, LeadCreatedResponse> {
  constructor(
    @Inject(InjectionConstant.LEAD_REPOSITORY)
    private readonly leadRepository: LeadsRepository,
    @Inject(InjectionConstant.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(InjectionConstant.TRANSACTION_SERVICE)
    private readonly transactionService: TransactionService,
  ) {
    super();
  }

  handle(command: CreateLeadCommand): Observable<LeadCreatedResponse> {
    const { leadGroup, skippedIndices, prospects } = command;
    return this.userRepository.findById(leadGroup.assignedTo).pipe(
      throwIfVoid(() => NotFound.of(User, leadGroup.assignedTo.toString())),
      delayWhen(() =>
        this.transactionService.runInTransaction(() =>
          zip(this.leadRepository.createLeadGroup(leadGroup), this.leadRepository.saveProspects(prospects)),
        ),
      ),
      map(() => plainToInstance(LeadCreatedResponse, { id: leadGroup.id.toString(), skipped: skippedIndices })),
    );
  }
}
