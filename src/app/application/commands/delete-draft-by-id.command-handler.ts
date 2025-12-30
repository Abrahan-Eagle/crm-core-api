import { BaseCommandHandler, CommandHandler, mapToVoid, NotFound, throwIfVoid } from '@internal/common';
import { TransactionService } from '@internal/mongo';
import { Inject } from '@nestjs/common';
import { delayWhen, forkJoin, iif, Observable, of } from 'rxjs';

import { ENTITY_MEDIA_TYPE, InjectionConstant } from '@/app/common';
import { DeleteDraftByIdCommand, DraftApplication, DraftApplicationRepository } from '@/domain/application';
import { StorageRepository } from '@/domain/media';

@CommandHandler(DeleteDraftByIdCommand)
export class DeleteDraftByIdCommandHandler extends BaseCommandHandler<DeleteDraftByIdCommand, void> {
  constructor(
    @Inject(InjectionConstant.DRAFT_APPLICATION_REPOSITORY)
    private readonly repository: DraftApplicationRepository,
    @Inject(InjectionConstant.TRANSACTION_SERVICE)
    private readonly transactionService: TransactionService,
    @Inject(InjectionConstant.STORAGE_REPOSITORY)
    private readonly storage: StorageRepository,
  ) {
    super();
  }

  handle(command: DeleteDraftByIdCommand): Observable<void> {
    const { draftId } = command;
    return this.repository.findById(draftId).pipe(
      throwIfVoid<DraftApplication>(() => NotFound.of(DraftApplication, draftId)),
      delayWhen((app: DraftApplication) => {
        const docs: string[] = app.bankStatements.map((doc) => doc.name);
        if (app.signatureUrl) {
          docs.push(app.signatureUrl);
        }

        return this.transactionService.runInTransaction(() =>
          this.repository
            .deleteById(app.id)
            .pipe(
              delayWhen(() =>
                iif(
                  () => docs.length > 0,
                  forkJoin(docs.map((doc) => this.storage.deleteFile(doc, ENTITY_MEDIA_TYPE.APPLICATION))),
                  of({}),
                ),
              ),
            ),
        );
      }),
      mapToVoid(),
    );
  }
}
