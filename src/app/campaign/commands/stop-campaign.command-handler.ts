import {
  BaseCommandHandler,
  catchInstanceOf,
  CommandHandler,
  NotFound,
  throwIfVoid,
  validateIf,
} from '@internal/common';
import { TransactionService } from '@internal/mongo';
import { Inject } from '@nestjs/common';
import { mergeMap, Observable, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Campaign, CampaignRepository, StopCampaignCommand } from '@/domain/campaign';
import { SchedulerService } from '@/domain/common';

@CommandHandler(StopCampaignCommand)
export class StopCampaignCommandHandler extends BaseCommandHandler<StopCampaignCommand, void> {
  constructor(
    @Inject(InjectionConstant.CAMPAIGN_REPOSITORY)
    private readonly repository: CampaignRepository,
    @Inject(InjectionConstant.TRANSACTION_SERVICE)
    private readonly transaction: TransactionService,
    @Inject(InjectionConstant.SCHEDULER_SERVICE)
    private readonly scheduler: SchedulerService,
  ) {
    super();
  }

  handle(command: StopCampaignCommand): Observable<void> {
    const { campaignId } = command;

    let jobId = '';

    return this.repository.getCampaignById(campaignId).pipe(
      throwIfVoid(() => NotFound.of(Campaign, campaignId)),
      validateIf(
        (campaign) => campaign.jobId !== null,
        () => NotFound.of(Campaign, campaignId),
      ),
      tap((campaign) => (jobId = campaign.jobId!)),
      tap((campaign) => campaign.stopCampaign().getOrThrow()),
      mergeMap((campaign) =>
        this.transaction.runInTransaction(() =>
          this.repository
            .updateCampaign(campaign)
            .pipe(mergeMap(() => this.scheduler.deleteJob(jobId!).pipe(catchInstanceOf(NotFound, () => void 0)))),
        ),
      ),
    );
  }
}
