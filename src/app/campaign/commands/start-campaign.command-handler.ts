import { BaseCommandHandler, CommandHandler, NotFound, throwIfVoid, validateIf } from '@internal/common';
import { TransactionService } from '@internal/mongo';
import { Inject } from '@nestjs/common';
import { mergeMap, Observable, tap } from 'rxjs';

import { HEADER_TENANT_ID, InjectionConstant, SchedulerServiceConfig } from '@/app/common';
import { Campaign, CampaignRepository, StartCampaignCommand } from '@/domain/campaign';
import { SchedulerService } from '@/domain/common';
import { ExtendedAuthContextStorage } from '@/infra/common';

@CommandHandler(StartCampaignCommand)
export class StartCampaignCommandHandler extends BaseCommandHandler<StartCampaignCommand, void> {
  constructor(
    @Inject(InjectionConstant.CAMPAIGN_REPOSITORY)
    private readonly repository: CampaignRepository,
    @Inject(InjectionConstant.TRANSACTION_SERVICE)
    private readonly transaction: TransactionService,
    @Inject(InjectionConstant.SCHEDULER_SERVICE)
    private readonly scheduler: SchedulerService,
    private readonly schedulerConfig: SchedulerServiceConfig,
    private readonly context: ExtendedAuthContextStorage,
  ) {
    super();
  }

  handle(command: StartCampaignCommand): Observable<void> {
    const { campaignId } = command;

    return this.repository.getCampaignById(campaignId).pipe(
      throwIfVoid(() => NotFound.of(Campaign, campaignId)),
      validateIf(
        (campaign) => campaign.jobId === null,
        () => NotFound.of(Campaign, campaignId),
      ),
      mergeMap((campaign) =>
        this.transaction.runInTransaction(() =>
          this.scheduler
            .schedule({
              name: campaign.subject,
              method: 'GET',
              url: `${
                this.schedulerConfig.config.currentServiceUrl
              }/v1/campaigns/${campaign.id.toString()}/send-next?key=${
                this.schedulerConfig.config.webhookAuthKey
              }&${HEADER_TENANT_ID}=${encodeURIComponent(this.context.store.tenantId)}`,
              priority: 'medium',
              repeat: {
                cron_pattern: '*/3 * * * * *',
                limit: campaign.contacts + 10,
              },
            })
            .pipe(
              tap((jobId) => campaign.startCampaign(jobId).getOrThrow()),
              mergeMap(() => this.repository.updateCampaign(campaign)),
            ),
        ),
      ),
    );
  }
}
