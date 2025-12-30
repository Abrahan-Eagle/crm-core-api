import { BaseCommandHandler, CommandHandler, mapToVoid, NotFound, throwIfVoid } from '@internal/common';
import { TransactionService } from '@internal/mongo';
import { Inject } from '@nestjs/common';
import { delayWhen, finalize, forkJoin, mergeMap, Observable, of, switchMap, tap, throwError, zip } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Campaign, CampaignContact, CampaignRepository, SendNextEmailFromCampaignCommand } from '@/domain/campaign';
import { CampaignFinish, EmailRequest, Id, MailerService, SchedulerService } from '@/domain/common';

@CommandHandler(SendNextEmailFromCampaignCommand)
export class SendNextEmailFromCampaignCommandHandler extends BaseCommandHandler<
  SendNextEmailFromCampaignCommand,
  void
> {
  /**
   * Temporary array to exclude current emails,
   * not necessary if concurrency is managed properly.
   **/
  private _workingWith: Set<string> = new Set();

  constructor(
    @Inject(InjectionConstant.CAMPAIGN_REPOSITORY)
    private readonly campaignRepository: CampaignRepository,
    @Inject(InjectionConstant.MAILER_SERVICE)
    private readonly mailer: MailerService,
    @Inject(InjectionConstant.TRANSACTION_SERVICE)
    private readonly transactionService: TransactionService,
    @Inject(InjectionConstant.SCHEDULER_SERVICE)
    private readonly scheduler: SchedulerService,
  ) {
    super();
  }

  handle(command: SendNextEmailFromCampaignCommand): Observable<void> {
    const { campaignId } = command;

    return forkJoin({
      campaign: this.campaignRepository
        .getCampaignById(campaignId)
        .pipe(throwIfVoid(() => NotFound.of(Campaign, campaignId))),
      contacts: this.campaignRepository.getNextPendingContacts(
        campaignId,
        5,
        Array.from(this._workingWith).map((id) => Id.load(id)),
      ),
    }).pipe(
      switchMap(({ campaign, contacts }) => {
        switch (campaign.jobId) {
          case null:
            return of({}).pipe(
              tap(() => console.log('Skipping campaign, waiting for jobId')),
              mapToVoid(),
            );

          default:
            return of({ campaign, contacts }).pipe(
              tap(({ contacts }) => contacts.forEach((contact) => this._workingWith.add(contact.contactId.toString()))),
              delayWhen(({ campaign, contacts }) =>
                contacts.length === 0
                  ? this.scheduler
                      .deleteJob(campaign!.jobId!)
                      .pipe(mergeMap(() => throwError(() => new CampaignFinish())))
                  : of(contacts),
              ),
              mergeMap(({ contacts }) =>
                zip(
                  contacts.map((contact) =>
                    of(contact).pipe(
                      tap((contact) => contact.markAsSended().getOrThrow()),
                      mergeMap(() =>
                        this.transactionService.runInTransaction(() =>
                          this.campaignRepository.updateContact(contact).pipe(
                            mergeMap(() => this.mailer.send(this._buildEmail(campaign, contact))),
                            finalize(() => this._workingWith.delete(contact.contactId.toString())),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            );
        }
      }),
      mapToVoid(),
    );
  }

  private _buildEmail(campaign: Campaign, contact: CampaignContact): EmailRequest {
    return {
      to: contact.email,
      from: campaign.sender,
      subject: campaign.subject,
      attachments: [],
      html: `<style>p {margin-bottom:8px;}</style>${campaign.message
        .replaceAll('[name]', contact.firstName || '')
        .replaceAll('[first_name]', contact.firstName || '')}`,
    };
  }
}
