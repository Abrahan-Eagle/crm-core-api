import { BaseCommandHandler, CommandHandler, mapToVoid, NotFound, throwIfVoid, validateIf } from '@internal/common';
import { TransactionService } from '@internal/mongo';
import { Inject } from '@nestjs/common';
import { delayWhen, map, mergeMap, zip } from 'rxjs';

import { ENTITY_MEDIA_TYPE, InjectionConstant } from '@/app/common';
import {
  Application,
  ApplicationRepository,
  DraftApplication,
  DraftApplicationRepository,
  PublishDraftApplicationCommand,
} from '@/domain/application';
import { ApplicationDraftIncompleted } from '@/domain/common';
import { StorageRepository } from '@/domain/media';

import { AppClonerService } from '../services';

@CommandHandler(PublishDraftApplicationCommand)
export class PublishDraftApplicationCommandHandler extends BaseCommandHandler<PublishDraftApplicationCommand, void> {
  constructor(
    @Inject(InjectionConstant.DRAFT_APPLICATION_REPOSITORY)
    private readonly draftRepository: DraftApplicationRepository,
    @Inject(InjectionConstant.APPLICATION_REPOSITORY)
    private readonly appRepository: ApplicationRepository,
    @Inject(InjectionConstant.STORAGE_REPOSITORY)
    private readonly storage: StorageRepository,
    @Inject(InjectionConstant.TRANSACTION_SERVICE)
    private readonly transactionService: TransactionService,
    private readonly clonerService: AppClonerService,
  ) {
    super();
  }

  handle(command: PublishDraftApplicationCommand) {
    return this.draftRepository.findById(command.draftId).pipe(
      throwIfVoid(() => NotFound.of(DraftApplication, command.draftId.toString())),
      validateIf(
        (application) => application.isValid,
        () => new ApplicationDraftIncompleted(),
      ),
      map((draft) => Application.createFromDraft(draft).getOrThrow()),
      mergeMap((application) => this.clonerService.cloneForAllTenants(application)),
      delayWhen<
        {
          application: Application;
          tenant: string;
        }[]
      >((apps) =>
        this.transactionService.runInTransaction(() => {
          return zip(this.appRepository.saveForTenants(apps), this.draftRepository.deleteById(command.draftId)).pipe(
            mergeMap(() =>
              zip(
                ...apps.map((cloned) =>
                  this.storage.saveFile(cloned.application.filledApplications[0].file!, ENTITY_MEDIA_TYPE.APPLICATION),
                ),
              ),
            ),
          );
        }),
      ),
      mapToVoid(),
    );
  }
}
