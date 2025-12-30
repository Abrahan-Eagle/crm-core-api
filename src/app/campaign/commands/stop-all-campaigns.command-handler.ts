import { BaseCommandHandler, catchInstanceOf, CommandHandler, mapToVoid, NotFound, Result } from '@internal/common';
import { TransactionService } from '@internal/mongo';
import { Inject } from '@nestjs/common';
import { delayWhen, mergeMap, Observable, tap, zip } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { CampaignRepository, StopAllCampaignsCommand } from '@/domain/campaign';
import { MailerService, SchedulerService } from '@/domain/common';

@CommandHandler(StopAllCampaignsCommand)
export class StopAllCampaignsCommandHandler extends BaseCommandHandler<StopAllCampaignsCommand, void> {
  constructor(
    @Inject(InjectionConstant.CAMPAIGN_REPOSITORY)
    private readonly repository: CampaignRepository,
    @Inject(InjectionConstant.TRANSACTION_SERVICE)
    private readonly transaction: TransactionService,
    @Inject(InjectionConstant.SCHEDULER_SERVICE)
    private readonly scheduler: SchedulerService,
    @Inject(InjectionConstant.MAILER_SERVICE)
    private readonly mailer: MailerService,
  ) {
    super();
  }

  handle(): Observable<void> {
    return this.repository.getActiveCampaigns().pipe(
      tap((campaigns) => Result.combine(campaigns.map((campaign) => campaign.stopCampaign())).getOrThrow()),
      mergeMap((campaigns) =>
        this.transaction.runInTransaction(() =>
          zip(
            campaigns.map((campaign) =>
              this.repository
                .updateCampaign(campaign)
                .pipe(
                  mergeMap(() =>
                    this.scheduler.deleteJob(campaign.jobId!).pipe(catchInstanceOf(NotFound, () => void 0)),
                  ),
                ),
            ),
          ),
        ),
      ),
      delayWhen(() =>
        this.mailer.send({
          from: 'deals@businessmarketfinders.com',
          subject: 'SES Reputation threshold reached',
          to: 'richard@richardtaty.com',
          message: `Active campaigns have been stopped`,
          attachments: [],
        }),
      ),
      mapToVoid(),
    );
  }
}
