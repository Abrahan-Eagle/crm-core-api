import { BaseCommandHandler, CommandHandler } from '@internal/common';
import { TransactionService } from '@internal/mongo';
import { Inject } from '@nestjs/common';
import { map, mergeMap, Observable, of } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { CampaignRepository, CreateCampaignCommand } from '@/domain/campaign';
import { Id } from '@/domain/common';

@CommandHandler(CreateCampaignCommand)
export class CreateCampaignCommandHandler extends BaseCommandHandler<CreateCampaignCommand, Id> {
  constructor(
    @Inject(InjectionConstant.CAMPAIGN_REPOSITORY)
    private readonly repository: CampaignRepository,
    @Inject(InjectionConstant.TRANSACTION_SERVICE)
    private readonly transactionService: TransactionService,
  ) {
    super();
  }

  handle(command: CreateCampaignCommand): Observable<Id> {
    return of(command).pipe(
      mergeMap(({ campaign, contacts }) =>
        this.transactionService.runInTransaction(() =>
          this.repository.createCampaign(campaign).pipe(mergeMap(() => this.repository.saveContacts(contacts))),
        ),
      ),
      map(() => command.campaign.id),
    );
  }
}
