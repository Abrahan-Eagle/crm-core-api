import { BaseCommandHandler, CommandHandler, mapToVoid } from '@internal/common';
import { TransactionService } from '@internal/mongo';
import { Inject } from '@nestjs/common';
import { mergeMap, Observable, of } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { CampaignComplaintCommand, CampaignRepository } from '@/domain/campaign';

@CommandHandler(CampaignComplaintCommand)
export class CampaignComplaintCommandHandler extends BaseCommandHandler<CampaignComplaintCommand, void> {
  constructor(
    @Inject(InjectionConstant.CAMPAIGN_REPOSITORY)
    private readonly repository: CampaignRepository,
    @Inject(InjectionConstant.TRANSACTION_SERVICE)
    private readonly transactionService: TransactionService,
  ) {
    super();
  }

  handle(command: CampaignComplaintCommand): Observable<void> {
    const { complainedContact } = command;

    return of(complainedContact).pipe(
      mergeMap((contacts) => this.transactionService.runInTransaction(() => this.repository.saveComplaints(contacts))),
      mapToVoid(),
    );
  }
}
