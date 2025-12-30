import { BaseCommandHandler, CommandHandler, mapToVoid, NotFound, throwIfVoid, validateIf } from '@internal/common';
import { TransactionService } from '@internal/mongo';
import { Inject } from '@nestjs/common';
import { delayWhen, forkJoin, iif, mergeMap, Observable, of } from 'rxjs';

import { ENTITY_MEDIA_TYPE, InjectionConstant } from '@/app/common';
import {
  Application,
  APPLICATION_STATUS,
  ApplicationRepository,
  DeleteApplicationByIdCommand,
} from '@/domain/application';
import { ApplicationBlocked } from '@/domain/common';
import { StorageRepository } from '@/domain/media';

@CommandHandler(DeleteApplicationByIdCommand)
export class DeleteApplicationByIdCommandHandler extends BaseCommandHandler<DeleteApplicationByIdCommand, void> {
  constructor(
    @Inject(InjectionConstant.APPLICATION_REPOSITORY)
    private readonly repository: ApplicationRepository,
    @Inject(InjectionConstant.TRANSACTION_SERVICE)
    private readonly transactionService: TransactionService,
    @Inject(InjectionConstant.STORAGE_REPOSITORY)
    private readonly storage: StorageRepository,
  ) {
    super();
  }

  handle(command: DeleteApplicationByIdCommand): Observable<void> {
    const { applicationId } = command;
    return this.repository.findById(applicationId).pipe(
      throwIfVoid(() => NotFound.of(Application, applicationId)),
      validateIf(
        (application) => application.status === APPLICATION_STATUS.READY_TO_SEND,
        (application) => new ApplicationBlocked(application.status),
      ),
      mergeMap((application) => this.repository.getAppsByCompanyId(application.period, application.companyId)),
      validateIf(
        (applications) => applications.every((app) => app.status === APPLICATION_STATUS.READY_TO_SEND),
        (applications) =>
          new ApplicationBlocked(
            applications.find((app) => app.status !== APPLICATION_STATUS.READY_TO_SEND)?.status ?? 'UNKNOWN',
          ),
      ),
      delayWhen((apps: Application[]) => {
        const docs: string[] = [];

        const appIds = apps.map((app) => app.id.toString());
        apps.forEach((app) => {
          app.allDocs.forEach((doc) => {
            // We avoid deleting documents that are referenced by other apps.
            const parentId = doc.name.split('/').at(0) ?? '';
            if (appIds.includes(parentId)) {
              docs.push(doc.name);
            }
          });
        });

        return this.transactionService.runInTransaction(() =>
          this.repository
            .deleteMany(apps.map((app) => app.id))
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
